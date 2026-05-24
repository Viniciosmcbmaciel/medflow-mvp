import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   LISTAR PACIENTES
========================================= */

router.get("/", async (_, res) => {
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
   CADASTRAR PACIENTE
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      cpf,
      birthDate,
      phone,
      insurance,
      email,
    } = req.body;

    const patient =
      await prisma.patient.create({
        data: {
          fullName,
          cpf,
          birthDate:
            birthDate || null,
          phone,
          insurance,
          email,
        },
      });

    return res.status(201).json(
      patient
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao cadastrar paciente",
    });
  }
});

export default router;