import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { createAuditLog } from '../utils/audit.js';

const router = Router();

router.get('/', async (_req, res) => {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      medicalRecords: {
        include: { anamnesis: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return res.json(patients);
});

router.post('/', async (req, res) => {
  const schema = z.object({
    fullName: z.string().min(3),
    cpf: z.string().optional().or(z.literal('')),
    birthDate: z.string().optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    allergies: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: parsed.error.flatten() });
  }

  const data = parsed.data;
  const patient = await prisma.patient.create({
    data: {
      fullName: data.fullName,
      cpf: data.cpf || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      allergies: data.allergies,
    },
  });

  await createAuditLog({
    userId: req.user?.id,
    action: 'CREATE',
    entity: 'PATIENT',
    entityId: patient.id,
    details: `Paciente ${patient.fullName} criado`,
    ipAddress: req.ip,
  });

  return res.status(201).json(patient);
});

export default router;
