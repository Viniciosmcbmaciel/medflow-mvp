import { Router } from "express";

import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   LISTAR EVOLUÇÕES
========================================= */
router.get(
  "/:patientId",
  async (req, res) => {
    try {
      const evolutions =
        await prisma.medicalEvolution.findMany({
          where: {
            patientId:
              req.params.patientId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json(evolutions);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao buscar evoluções.",
      });
    }
  }
);

/* =========================================
   CRIAR EVOLUÇÃO
========================================= */
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      notes,
    } = req.body;

    if (!patientId || !notes) {
      return res.status(400).json({
        message:
          "Dados obrigatórios.",
      });
    }

    const evolution =
      await prisma.medicalEvolution.create({
        data: {
          patientId,
          notes,
        } as any,
      });

    return res.json(evolution);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao criar evolução.",
    });
  }
});

export default router;