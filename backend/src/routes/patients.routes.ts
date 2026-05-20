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
   BUSCAR PACIENTE
========================================= */

router.get(
  "/search/:term",
  async (req, res) => {
    try {
      const { term } =
        req.params;

      const patients =
        await prisma.patient.findMany(
          {
            where: {
              OR: [
                {
                  fullName: {
                    contains:
                      term,
                    mode:
                      "insensitive",
                  },
                },

                {
                  cpf: {
                    contains:
                      term,
                  },
                },
              ],
            },

            take: 10,
          }
        );

      return res.json(
        patients
      );
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Erro ao buscar paciente",
        });
    }
  }
);

/* =========================================
   CRIAR PACIENTE
========================================= */

router.post("/", async (req, res) => {
  try {
    const existingCpf =
      await prisma.patient.findFirst(
        {
          where: {
            cpf: req.body.cpf,
          },
        }
      );

    if (existingCpf) {
      return res.status(400).json({
        message:
          "CPF já cadastrado",
      });
    }

    const patient =
      await prisma.patient.create({
        data: {
          fullName:
            req.body.fullName,

          cpf: req.body.cpf,

          birthDate:
            req.body.birthDate,

          gender:
            req.body.gender,

          phone:
            req.body.phone,

          email:
            req.body.email,

          insurance:
            req.body.insurance,

          maritalStatus:
            req.body.maritalStatus,

          occupation:
            req.body.occupation,

          emergencyContact:
            req.body.emergencyContact,

          emergencyPhone:
            req.body.emergencyPhone,

          address:
            req.body.address,

          city:
            req.body.city,

          state:
            req.body.state,

          zipCode:
            req.body.zipCode,

          allergies:
            req.body.allergies,

          bloodType:
            req.body.bloodType,

          observations:
            req.body.observations,
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