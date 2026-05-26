import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   CREATE MEDICAL RECORD
========================================= */

router.post("/", async (req, res) => {
  const schema = z.object({
    patientId: z.string().min(1),

    chiefComplaint: z
      .string()
      .min(
        1,
        "Queixa principal é obrigatória."
      ),

    historyPresentIllness:
      z.string().optional().nullable(),

    physicalExam:
      z.string().optional().nullable(),

    diagnosticHypothesis:
      z.string().optional().nullable(),

    conduct:
      z.string().optional().nullable(),

    prescription:
      z.string().optional().nullable(),

    notes:
      z.string().optional().nullable(),
  });

  const parsed =
    schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors:
        parsed.error.flatten(),
    });
  }

  try {
    const record =
      await prisma.medicalRecord.create({
        data: {
          patientId:
            parsed.data.patientId,

          chiefComplaint:
            parsed.data
              .chiefComplaint,

          historyPresentIllness:
            parsed.data
              .historyPresentIllness ??
            null,

          physicalExam:
            parsed.data
              .physicalExam ??
            null,

          diagnosticHypothesis:
            parsed.data
              .diagnosticHypothesis ??
            null,

          conduct:
            parsed.data
              .conduct ?? null,

          prescription:
            parsed.data
              .prescription ??
            null,

          notes:
            parsed.data.notes ??
            null,
        },
      });

    return res
      .status(201)
      .json(record);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao criar registro clínico.",
    });
  }
});

/* =========================================
   GET RECORDS BY PATIENT
========================================= */

router.get(
  "/:patientId",
  async (req, res) => {
    try {
      const { patientId } =
        req.params;

      const records =
        await prisma.medicalRecord.findMany(
          {
            where: {
              patientId,
            },

            orderBy: {
              createdAt:
                "desc",
            },
          }
        );

      return res.json(records);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Erro ao buscar registros clínicos.",
        });
    }
  }
);

export default router;