import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================
   LISTAR EVOLUÇÕES
========================= */
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const evolutions =
      await prisma.medicalEvolution.findMany({
        where: {
          patientId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(evolutions);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao listar evoluções",
    });
  }
});

/* =========================
   CRIAR EVOLUÇÃO
========================= */
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      doctorId,

      chiefComplaint,
      diagnosis,
      conduct,
      observations,
      cid,

      bloodPressure,
      weight,
      height,
      temperature,
    } = req.body;

    const evolution =
      await prisma.medicalEvolution.create({
        data: {
          patientId,
          doctorId,

          chiefComplaint,
          diagnosis,
          conduct,
          observations,
          cid,

          bloodPressure,
          weight,
          height,
          temperature,
        },
      });

    return res.status(201).json(evolution);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao salvar evolução",
    });
  }
});

export default router;