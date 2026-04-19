import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { createAuditLog } from '../utils/audit.js';

const router = Router();

router.post('/', async (req, res) => {
  const schema = z.object({
    patientId: z.string().min(1),
    chiefComplaint: z.string().optional(),
    clinicalNotes: z.string().optional(),
    anamnesis: z.object({
      currentIllness: z.string().optional(),
      medicalHistory: z.string().optional(),
      familyHistory: z.string().optional(),
      habits: z.string().optional(),
      medicationsInUse: z.string().optional(),
      physicalExam: z.string().optional(),
    }).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success || !req.user) {
    return res.status(400).json({ message: 'Dados inválidos ou usuário não autenticado.' });
  }

  const record = await prisma.medicalRecord.create({
    data: {
      patientId: parsed.data.patientId,
      professionalId: req.user.id,
      chiefComplaint: parsed.data.chiefComplaint,
      clinicalNotes: parsed.data.clinicalNotes,
      anamnesis: parsed.data.anamnesis
        ? {
            create: parsed.data.anamnesis,
          }
        : undefined,
    },
    include: { anamnesis: true },
  });

  await createAuditLog({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'MEDICAL_RECORD',
    entityId: record.id,
    details: 'Prontuário criado',
    ipAddress: req.ip,
  });

  return res.status(201).json(record);
});

router.get('/patient/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      anamnesis: true,
      prescriptions: { include: { items: true, document: { include: { signature: true } } } },
      examOrders: { include: { items: true, document: { include: { signature: true } } } },
      professional: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(records);
});

export default router;
