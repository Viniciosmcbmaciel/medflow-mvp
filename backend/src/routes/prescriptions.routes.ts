import { Router } from "express";
import { z } from "zod";

import { prisma } from "../config/prisma.js";

import { buildSignatureHash } from "../utils/hash.js";

import { createAuditLog } from "../utils/audit.js";

import { generateSimplePdf } from "../utils/pdf.js";

const router = Router();

/* =========================================
   LISTAR PRESCRICOES POR PACIENTE
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

              medicalRecord: {
                include: {
                  patient: true,
                },
              },

              document: {
                include: {
                  signature: true,
                },
              },
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
          "Erro ao buscar prescrições.",
      });
    }
  }
);

/* =========================================
   CRIAR PRESCRICAO
========================================= */

router.post(
  "/",
  async (req, res) => {
    try {
      const schema = z.object({
        medicalRecordId:
          z.string(),

        notes:
          z.string().optional(),

        items: z
          .array(
            z.object({
              medication:
                z.string(),

              dosage:
                z.string(),

              instructions:
                z.string(),

              duration:
                z.string().optional(),
            })
          )
          .min(1),
      });

      const parsed =
        schema.safeParse(
          req.body
        );

      if (!parsed.success) {
        return res.status(400).json({
          message:
            "Dados inválidos.",
        });
      }

      /* =========================================
         CRIAR PRESCRICAO
      ========================================= */

      const prescription =
        await prisma.prescription.create(
          {
            data: {
              medicalRecordId:
                parsed.data
                  .medicalRecordId,

              notes:
                parsed.data.notes,

              items: {
                create:
                  parsed.data.items,
              },
            },

            include: {
              items: true,
            },
          }
        );

      /* =========================================
         DOCUMENTO
      ========================================= */

      const content =
        JSON.stringify({
          prescriptionId:
            prescription.id,

          items:
            prescription.items,

          notes:
            prescription.notes,
        });

      const document =
        await prisma.document.create(
          {
            data: {
              medicalRecordId:
                parsed.data
                  .medicalRecordId,

              type:
                "PRESCRIPTION",

              content,

              prescriptionId:
                prescription.id,
            },
          }
        );

      /* =========================================
         AUDITORIA
      ========================================= */

      try {
        await createAuditLog({
          userId:
            req.user?.id,

          action:
            "CREATE",

          entity:
            "PRESCRIPTION",

          entityId:
            prescription.id,

          ipAddress:
            req.ip,
        });
      } catch (
        auditError
      ) {
        console.error(
          "Erro auditoria:",
          auditError
        );
      }

      return res
        .status(201)
        .json({
          success: true,

          prescription,

          documentId:
            document.id,
        });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao salvar prescrição.",
      });
    }
  }
);

/* =========================================
   ASSINAR PRESCRICAO
========================================= */

router.post(
  "/:id/sign",
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message:
            "Não autenticado.",
        });
      }

      const prescription =
        await prisma.prescription.findUnique(
          {
            where: {
              id: req.params.id,
            },

            include: {
              items: true,

              document: true,
            },
          }
        );

      if (
        !prescription ||
        !prescription.document
      ) {
        return res.status(404).json({
          message:
            "Prescrição não encontrada.",
        });
      }

      /* =========================================
         HASH
      ========================================= */

      const hash =
        buildSignatureHash(
          `${prescription.document.content}|${req.user.id}|${new Date().toISOString()}`
        );

      /* =========================================
         ASSINATURA
      ========================================= */

      const signature =
        await prisma.signature.create(
          {
            data: {
              documentId:
                prescription
                  .document.id,

              hash,

              signedBy:
                req.user.email,
            },
          }
        );

      /* =========================================
         UPDATE
      ========================================= */

      await prisma.prescription.update(
        {
          where: {
            id:
              prescription.id,
          },

          data: {
            signed: true,

            signedAt:
              signature.signedAt,
          },
        }
      );

      /* =========================================
         AUDITORIA
      ========================================= */

      await createAuditLog({
        userId:
          req.user.id,

        action: "SIGN",

        entity:
          "PRESCRIPTION",

        entityId:
          prescription.id,

        details:
          `Assinatura hash ${hash}`,

        ipAddress:
          req.ip,
      });

      return res.json({
        message:
          "Prescrição assinada.",

        signature,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao assinar prescrição.",
      });
    }
  }
);

/* =========================================
   PDF
========================================= */

router.get(
  "/:id/pdf",
  async (req, res) => {
    try {
      const prescription =
        await prisma.prescription.findUnique(
          {
            where: {
              id: req.params.id,
            },

            include: {
              items: true,

              document: {
                include: {
                  signature: true,
                },
              },

              medicalRecord: {
                include: {
                  patient: true,

                  user: true,
                },
              },
            },
          }
        );

      if (!prescription) {
        return res.status(404).json({
          message:
            "Prescrição não encontrada.",
        });
      }

      /* =========================================
         ITENS
      ========================================= */

      const itemsText =
        prescription.items
          .map(
            (
              item,
              index
            ) =>
              `${index + 1}. Medicamento: ${item.medication}

Dosagem: ${item.dosage}

Instruções: ${item.instructions}

Duração: ${item.duration || "—"}`
          )
          .join("\n\n");

      /* =========================================
         PDF
      ========================================= */

      return generateSimplePdf(
        res,

        "Prescrição Médica",

        [
          {
            label:
              "Paciente",

            value:
              prescription
                .medicalRecord
                .patient
                .fullName,
          },

          {
            label:
              "Data da prescrição",

            value:
              new Date(
                prescription.createdAt
              ).toLocaleString(
                "pt-BR"
              ),
          },

          {
            label:
              "Itens prescritos",

            value:
              itemsText ||
              "—",
          },

          {
            label:
              "Observações",

            value:
              prescription.notes ||
              "—",
          },
        ],

        `prescricao-${prescription.id}.pdf`,

        {
          professionalName:
            prescription
              .document
              ?.signature
              ?.signedBy ||
            "Médico responsável",

          professionalCrm:
            "CRM 000000",

          signed:
            prescription.signed,

          signedBy:
            prescription
              .document
              ?.signature
              ?.signedBy,
        }
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao gerar PDF da prescrição.",
      });
    }
  }
);

export default router;