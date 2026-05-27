import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";

const router = Router();

const prisma = new PrismaClient();

/* =========================================
   CREATE PRESCRIPTION
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      medicalRecordId,
      notes,
      items,
    } = req.body;

    if (!medicalRecordId) {
      return res.status(400).json({
        error:
          "Prontuário obrigatório",
      });
    }

    const prescription =
      await prisma.prescription.create({
        data: {
          medicalRecordId,

          notes,

          items: {
            create: items.map(
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

          medicalRecord: {
            include: {
              patient: true,
            },
          },
        },
      });

    return res
      .status(201)
      .json(prescription);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erro ao criar prescrição",
    });
  }
});

/* =========================================
   GET BY RECORD
========================================= */

router.get(
  "/record/:medicalRecordId",
  async (req, res) => {
    try {
      const prescriptions =
        await prisma.prescription.findMany(
          {
            where: {
              medicalRecordId:
                req.params
                  .medicalRecordId,
            },

            include: {
              items: true,
            },

            orderBy: {
              createdAt:
                "desc",
            },
          }
        );

      return res.json(
        prescriptions
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao buscar prescrições",
      });
    }
  }
);

/* =========================================
   PDF
========================================= */

router.get(
  "/pdf/:id",
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

              medicalRecord: {
                include: {
                  patient: true,
                },
              },
            },
          }
        );

      if (!prescription) {
        return res.status(404).json({
          error:
            "Prescrição não encontrada",
        });
      }

      const patient =
        prescription
          .medicalRecord.patient;

      const doc =
        new PDFDocument({
          margin: 50,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `inline; filename=prescricao-${prescription.id}.pdf`
      );

      doc.pipe(res);

      /* HEADER */

      doc
        .fontSize(28)
        .text("MEDFLOW", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(18)
        .text(
          "Prescrição Médica",
          {
            align: "center",
          }
        );

      doc.moveDown(2);

      /* PATIENT */

      doc
        .fontSize(14)
        .text(
          `Paciente: ${patient.fullName}`
        );

      doc.text(
        `CPF: ${patient.cpf || "-"}`
      );

      doc.text(
        `Data: ${new Date().toLocaleDateString(
          "pt-BR"
        )}`
      );

      doc.moveDown(2);

      /* ITEMS */

      prescription.items.forEach(
        (item, index) => {
          doc
            .fontSize(15)
            .text(
              `${index + 1}. ${item.medication}`
            );

          doc
            .fontSize(12)
            .text(
              `Dosagem: ${item.dosage}`
            );

          doc.text(
            `Instruções: ${item.instructions}`
          );

          doc.text(
            `Duração: ${item.duration || "-"}`
          );

          doc.moveDown();
        }
      );

      /* NOTES */

      if (prescription.notes) {
        doc.moveDown();

        doc
          .fontSize(14)
          .text("Observações");

        doc.moveDown(0.5);

        doc
          .fontSize(12)
          .text(
            prescription.notes
          );
      }

      /* SIGNATURE */

      doc.moveDown(4);

      doc.text(
        "__________________________________",
        {
          align: "center",
        }
      );

      doc.text(
        "Dr. MedFlow",
        {
          align: "center",
        }
      );

      doc.text(
        "CRM 123456",
        {
          align: "center",
        }
      );

      doc.end();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao gerar PDF",
      });
    }
  }
);

export default router;