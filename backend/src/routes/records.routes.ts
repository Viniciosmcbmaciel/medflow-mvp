import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    patientId: z.string().min(1),
    chiefComplaint: z.string().min(1, "Queixa principal é obrigatória."),
    historyPresentIllness: z.string().optional().nullable(),
    medications: z.string().optional().nullable(),
    physicalExam: z.string().optional().nullable(),
    conduct: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: parsed.data.patientId,
        chiefComplaint: parsed.data.chiefComplaint,
        historyPresentIllness: parsed.data.historyPresentIllness ?? null,
        medications: parsed.data.medications ?? null,
        physicalExam: parsed.data.physicalExam ?? null,
        conduct: parsed.data.conduct ?? null,
        notes: parsed.data.notes ?? null,
      },
    });

    return res.status(201).json(record);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar registro clínico." });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: { patientId: req.params.patientId },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            cpf: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(records);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar registros clínicos." });
  }
});

export default router;