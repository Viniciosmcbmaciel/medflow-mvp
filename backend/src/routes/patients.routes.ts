import { Router } from "express";
import { prisma } from "../config/prisma";

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

    res.json(patients);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao buscar pacientes",
    });
  }
});

/* =========================================
   BUSCAR PACIENTE
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const patient =
      await prisma.patient.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!patient) {
      return res.status(404).json({
        error:
          "Paciente não encontrado",
      });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao buscar paciente",
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
      cpf,
      birthDate,
      phone,
      insurance,
      email,
    } = req.body;

    if (!fullName) {
      return res.status(400).json({
        error:
          "Nome obrigatório",
      });
    }

    const patient =
      await prisma.patient.create({
        data: {
          fullName,
          cpf,
          birthDate,
          phone,
          insurance,
          email,
        },
      });

    res.json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao cadastrar paciente",
    });
  }
});

/* =========================================
   EDITAR PACIENTE
========================================= */

router.put("/:id", async (req, res) => {
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
      await prisma.patient.update({
        where: {
          id: req.params.id,
        },

        data: {
          fullName,
          cpf,
          birthDate,
          phone,
          insurance,
          email,
        },
      });

    res.json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao atualizar paciente",
    });
  }
});

/* =========================================
   EXCLUIR PACIENTE
========================================= */

router.delete("/:id", async (req, res) => {
  try {
    await prisma.patient.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao excluir paciente",
    });
  }
});

export default router;