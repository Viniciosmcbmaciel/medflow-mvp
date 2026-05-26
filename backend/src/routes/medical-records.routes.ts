import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   CREATE MEDICAL RECORD
========================================= */

router.post("/", async (req, res) => {
  const schema = z.object({
    patientId: z.string(),

    chiefComplaint: z.string().optional().nullable(),

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
      error: "Dados inválidos",
      details:
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
              .historyPresentIllness,

          physicalExam:
            parsed.data
              .physicalExam,

          diagnosticHypothesis:
            parsed.data
              .diagnosticHypothesis,

          conduct:
            parsed.data.conduct,

          prescription:
            parsed.data
              .prescription,

          notes:
            parsed.data.notes,
        },
      });

    return res.status(201).json(
      record
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erro ao salvar prontuário",
    });
  }
});

/* =========================================
   GET PATIENT HISTORY
========================================= */

router.get(
  "/patient/:patientId",
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
              createdAt: "desc",
            },

            include: {
              patient: true,
            },
          }
        );

      return res.json(records);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao buscar histórico",
      });
    }
  }
);

/* =========================================
   GET SINGLE RECORD
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const record =
      await prisma.medicalRecord.findUnique(
        {
          where: { id },

          include: {
            patient: true,
          },
        }
      );

    if (!record) {
      return res.status(404).json({
        error:
          "Prontuário não encontrado",
      });
    }

    return res.json(record);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erro ao buscar prontuário",
    });
  }
});

/* =========================================
   UPDATE RECORD
========================================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated =
      await prisma.medicalRecord.update({
        where: { id },

        data: {
          chiefComplaint:
            req.body.chiefComplaint,

          historyPresentIllness:
            req.body
              .historyPresentIllness,

          physicalExam:
            req.body.physicalExam,

          diagnosticHypothesis:
            req.body
              .diagnosticHypothesis,

          conduct:
            req.body.conduct,

          prescription:
            req.body.prescription,

          notes:
            req.body.notes,
        },
      });

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erro ao atualizar prontuário",
    });
  }
});

/* =========================================
   DELETE RECORD
========================================= */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.medicalRecord.delete({
        where: { id },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao excluir prontuário",
      });
    }
  }
);

export default router;