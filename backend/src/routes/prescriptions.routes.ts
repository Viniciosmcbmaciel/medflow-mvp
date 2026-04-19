import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { buildSignatureHash } from '../utils/hash.js';
import { createAuditLog } from '../utils/audit.js';
import { generateSimplePdf } from '../utils/pdf.js';

const router = Router();

router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: {
        medicalRecord: {
          patientId,
        },
      },
      include: {
        items: true,
        medicalRecord: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(prescriptions);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar prescrições.' });
  }
});

router.post('/', async (req, res) => {
  const schema = z.object({
    medicalRecordId: z.string(),
    notes: z.string().optional(),
    items: z.array(
      z.object({
        medication: z.string().min(1),
        dosage: z.string().min(1),
        instructions: z.string().min(1),
        duration: z.string().optional(),
      })
    ).min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Dados inválidos.' });
  }

  const prescription = await prisma.prescription.create({
    data: {
      medicalRecordId: parsed.data.medicalRecordId,
      notes: parsed.data.notes,
      items: {
        create: parsed.data.items,
      },
    },
    include: { items: true },
  });

  const content = JSON.stringify({
    prescriptionId: prescription.id,
    items: prescription.items,
    notes: prescription.notes,
  });

  const document = await prisma.document.create({
    data: {
      medicalRecordId: parsed.data.medicalRecordId,
      type: 'PRESCRIPTION',
      content,
      prescriptionId: prescription.id,
    },
  });

  await createAuditLog({
    userId: req.user?.id,
    action: 'CREATE',
    entity: 'PRESCRIPTION',
    entityId: prescription.id,
    ipAddress: req.ip,
  });

  return res.status(201).json({ ...prescription, documentId: document.id });
});

router.post('/:id/sign', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: req.params.id },
    include: { items: true, document: true },
  });

  if (!prescription || !prescription.document) {
    return res.status(404).json({ message: 'Prescrição não encontrada.' });
  }

  const hash = buildSignatureHash(
    `${prescription.document.content}|${req.user.id}|${new Date().toISOString()}`
  );

  const signature = await prisma.signature.create({
    data: {
      documentId: prescription.document.id,
      hash,
      signedBy: req.user.email,
    },
  });

  await prisma.prescription.update({
    where: { id: prescription.id },
    data: { signed: true, signedAt: signature.signedAt },
  });

  await createAuditLog({
    userId: req.user.id,
    action: 'SIGN',
    entity: 'PRESCRIPTION',
    entityId: prescription.id,
    details: `Assinatura hash ${hash}`,
    ipAddress: req.ip,
  });

  return res.json({ message: 'Prescrição assinada.', signature });
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        document: {
          include: {
            signature: true,
          },
        },
        medicalRecord: {
          include: {
            patient: true,
            user: true,
          },
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescrição não encontrada.' });
    }

    const itemsText = prescription.items
      .map(
        (item, index) =>
          `${index + 1}. Medicamento: ${item.medication}\nDosagem: ${item.dosage}\nInstruções: ${item.instructions}\nDuração: ${item.duration || '—'}`
      )
      .join('\n\n');

    return generateSimplePdf(
      res,
      'Prescrição Médica',
      [
        { label: 'Paciente', value: prescription.medicalRecord.patient.fullName },
        {
          label: 'Data da prescrição',
          value: new Date(prescription.createdAt).toLocaleString('pt-BR'),
        },
        { label: 'Itens prescritos', value: itemsText || '—' },
        { label: 'Observações', value: prescription.notes || '—' },
      ],
      `prescricao-${prescription.id}.pdf`,
      {
        professionalName: prescription.document?.signature?.signedBy || 'Médico responsável',
        professionalCrm: 'CRM 000000',
        signed: prescription.signed,
        signedBy: prescription.document?.signature?.signedBy || undefined,
      }
    );
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao gerar PDF da prescrição.' });
  }
});

export default router;