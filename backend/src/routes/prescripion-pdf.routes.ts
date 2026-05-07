import { Router } from "express";
import PDFDocument from "pdfkit";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      patientName,
      doctorName,
      crm,
      medications,
      instructions,
    } = req.body;

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "inline; filename=prescricao.pdf"
    );

    doc.pipe(res);

    /* HEADER */
    doc
      .fontSize(26)
      .fillColor("#2563eb")
      .text("PRESCRIÇÃO MÉDICA", {
        align: "center",
      });

    doc.moveDown(2);

    /* PACIENTE */
    doc
      .fontSize(14)
      .fillColor("#111827")
      .text(`Paciente: ${patientName}`);

    doc.moveDown();

    /* MEDICAMENTOS */
    doc
      .fontSize(18)
      .fillColor("#2563eb")
      .text("Medicamentos");

    doc.moveDown();

    medications.forEach(
      (med: any, index: number) => {
        doc
          .fontSize(13)
          .fillColor("#111827")
          .text(
            `${index + 1}. ${med.name}`
          );

        doc
          .fontSize(12)
          .fillColor("#4b5563")
          .text(`Posologia: ${med.dosage}`);

        doc
          .fontSize(12)
          .fillColor("#4b5563")
          .text(`Duração: ${med.duration}`);

        doc.moveDown();
      }
    );

    /* ORIENTAÇÕES */
    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("#2563eb")
      .text("Orientações");

    doc.moveDown();

    doc
      .fontSize(12)
      .fillColor("#111827")
      .text(instructions || "-");

    /* ASSINATURA */
    doc.moveDown(5);

    doc
      .fontSize(13)
      .fillColor("#111827")
      .text(doctorName, {
        align: "center",
      });

    doc
      .fontSize(11)
      .fillColor("#6b7280")
      .text(`CRM: ${crm}`, {
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao gerar PDF",
    });
  }
});

export default router;