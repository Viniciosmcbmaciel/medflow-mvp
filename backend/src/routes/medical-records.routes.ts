import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateSimplePdf } from "../utils/pdf.js";

const router = Router();
const prisma = new PrismaClient();

/* =========================================
   LISTAR HISTÓRICO DO PACIENTE
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
              createdAt:
                "desc",
            },

            include: {
              patient: true,
            },
          }
        );

      return res.json(records);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Erro ao buscar prontuários",
        });
    }
  }
);

/* =========================================
   CRIAR PRONTUÁRIO
========================================= */

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        patientId,
        chiefComplaint,
        diagnosis,
        evolution,
      } = req.body;

      if (
        !patientId ||
        !chiefComplaint
      ) {
        return res
          .status(400)
          .json({
            error:
              "Paciente e queixa principal são obrigatórios.",
          });
      }

      /* VALIDAR PACIENTE */

      const patient =
        await prisma.patient.findUnique(
          {
            where: {
              id: patientId,
            },
          }
        );

      if (!patient) {
        return res
          .status(404)
          .json({
            error:
              "Paciente não encontrado.",
          });
      }

      /* CRIAR PRONTUÁRIO */

      const record =
        await prisma.medicalRecord.create(
          {
            data: {
              patientId,

              chiefComplaint,

              diagnosis,

              evolution,
            },

            include: {
              patient: true,
            },
          }
        );

      return res
        .status(201)
        .json(record);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Erro ao criar prontuário",
        });
    }
  }
);

/* =========================================
   PDF DO PRONTUÁRIO
========================================= */

router.get(
  "/:id/pdf",
  async (req, res) => {
    try {
      const { id } =
        req.params;

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
        return res
          .status(404)
          .json({
            error:
              "Registro não encontrado.",
          });
      }

      return generateSimplePdf(
        res,
        "Evolução Clínica / Prontuário",
        [
          {
            label:
              "Paciente",
            value:
              record.patient
                .fullName,
          },

          {
            label:
              "Data do registro",

            value:
              new Date(
                record.createdAt
              ).toLocaleString(
                "pt-BR"
              ),
          },

          {
            label:
              "Queixa principal",

            value:
              record.chiefComplaint ||
              "—",
          },

          {
            label:
              "Diagnóstico",

            value:
              record.diagnosis ||
              "—",
          },

          {
            label:
              "Evolução",

            value:
              record.evolution ||
              "—",
          },
        ],

        `prontuario-${record.id}.pdf`,

        {
          professionalName:
            "Médico responsável",

          professionalCrm:
            "CRM 000000",

          signed: false,
        }
      );
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Erro ao gerar PDF do prontuário.",
        });
    }
  }
);

export default router;