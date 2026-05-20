import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   LISTAR PACIENTES
========================================= */

router.get("/", async (req, res) => {
  try {
    const patients =
      await prisma.patient.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(patients);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao buscar pacientes",
    });
  }
});

/* =========================================
   CRIAR PACIENTE
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      birthDate,
      cpf,
      phone,
      email,
      insurance,
    } = req.body;

    const patient =
      await prisma.patient.create({
        data: {
          fullName,

          birthDate:
            birthDate || null,

          cpf,

          phone,

          email,

          insurance,
        },
      });

    return res.status(201).json(
      patient
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao criar paciente",
    });
  }
});

export default router;