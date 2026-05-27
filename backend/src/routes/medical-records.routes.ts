import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";

const router = Router();

const prisma = new PrismaClient();

/* =========================================
   CREATE RECORD
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      chiefComplaint,
      historyPresentIllness,
      physicalExam,
      diagnosticHypothesis,
      conduct,
      prescription,
      notes,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({
        error: "Paciente obrigatório",
      });
    }

    const record =
      await prisma.medicalRecord.create({
        data: {
          patientId,

          chiefComplaint,

          historyPresentIllness,

          physicalExam,

          diagnosticHypothesis,

          conduct,

          prescription,

          notes,
        },
      });

    return res.status(201).json(record);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erro ao salvar prontuário",
    });
  }
});

/* =========================================
   LIST HISTORY
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
              createdAt: "desc",
            },
          }
        );

      return res.json(records);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao buscar histórico",
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
      const { id } = req.params;

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
        return res.status(404).json({
          error:
            "Prontuário não encontrado",
        });
      }

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
        `inline; filename=prontuario-${id}.pdf`
      );

      doc.pipe(res);

      /* HEADER */

      doc
        .fontSize(24)
        .text("MEDFLOW", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(18)
        .text("Prontuário Médico", {
          align: "center",
        });

      doc.moveDown(2);

      /* PACIENTE */

      doc
        .fontSize(16)
        .text("Dados do Paciente");

      doc.moveDown();

      doc.fontSize(12);

      doc.text(
        `Nome: ${record.patient.fullName}`
      );

      doc.text(
        `CPF: ${record.patient.cpf || "-"}`
      );

      doc.text(
        `Telefone: ${record.patient.phone || "-"}`
      );

      doc.text(
        `Convênio: ${record.patient.insurance || "-"}`
      );

      doc.moveDown(2);

      /* SOAP */

      function section(
        title: string,
        content?: string | null
      ) {
        doc
          .fontSize(15)
          .text(title);

        doc.moveDown(0.5);

        doc
          .fontSize(12)
          .text(content || "-");

        doc.moveDown(1.5);
      }

      section(
        "Queixa Principal",
        record.chiefComplaint
      );

      section(
        "História da Doença Atual",
        record.historyPresentIllness
      );

      section(
        "Exame Físico",
        record.physicalExam
      );

      section(
        "Hipótese Diagnóstica",
        record.diagnosticHypothesis
      );

      section(
        "Conduta",
        record.conduct
      );

      section(
        "Prescrição",
        record.prescription
      );

      section(
        "Observações",
        record.notes
      );

      /* FOOTER */

      doc.moveDown(2);

      doc
        .fontSize(10)
        .text(
          `Gerado em ${new Date().toLocaleString(
            "pt-BR"
          )}`,
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