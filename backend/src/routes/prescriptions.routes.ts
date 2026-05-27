import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

/* =========================================
   LISTAR PRESCRIÇÕES POR PACIENTE
========================================= */

router.get(
  "/patient/:patientId",
  async (req, res) => {
    try {
      const { patientId } =
        req.params;

      const prescriptions =
        await prisma.prescription.findMany(
          {
            where: {
              medicalRecord: {
                patientId,
              },
            },

            include: {
              items: true,

              medicalRecord: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          }
        );

      return res.json(
        prescriptions
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao buscar prescrições",
      });
    }
  }
);

/* =========================================
   CRIAR PRESCRIÇÃO
========================================= */

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        medicalRecordId,
        notes,
        items,
      } = req.body;

      if (!medicalRecordId) {
        return res.status(400).json({
          message:
            "medicalRecordId obrigatório",
        });
      }

      const prescription =
        await prisma.prescription.create(
          {
            data: {
              medicalRecordId,

              notes,

              items: {
                create:
                  items.map(
                    (item: any) => ({
                      medication:
                        item.medication,

                      dosage:
                        item.dosage,

                      instructions:
                        item.instructions,

                      duration:
                        item.duration,
                    })
                  ),
              },
            },

            include: {
              items: true,
            },
          }
        );

      return res
        .status(201)
        .json(prescription);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao criar prescrição",
      });
    }
  }
);

export default router;