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

    const buffers: any[] = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      res.writeHead(200, {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          "inline; filename=prescricao.pdf",

        "Content-Length":
          pdfData.length,
      });

      res.end(pdfData);
    });

    /* HEADER */
    doc
      .fontSize(24)
      .fillColor("#166534")
      .text("PRESCRIÇÃO MÉDICA", {
        align: "center",
      });

    doc.moveDown(2);

    /* PACIENTE */
    doc
      .fontSize(14)
      .fillColor("#000")
      .text(`Paciente: ${patientName}`);

    doc.moveDown();

    /* MÉDICO */
    doc.text(`Médico: ${doctorName}`);

    doc.text(`CRM: ${crm}`);

    doc.moveDown(2);

    /* MEDICAMENTOS */
    doc
      .fontSize(18)
      .fillColor("#166534")
      .text("Medicamentos");

    doc.moveDown();

    medications.forEach(
      (med: any, index: number) => {
        doc
          .fontSize(13)
          .fillColor("#000")
          .text(
            `${index + 1}. ${med.name}`
          );

        doc.text(
          `Posologia: ${med.dosage}`
        );

        doc.text(
          `Duração: ${med.duration}`
        );

        doc.moveDown();
      }
    );

    /* ORIENTAÇÕES */
    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("#166534")
      .text("Orientações");

    doc.moveDown();

    doc
      .fontSize(13)
      .fillColor("#000")
      .text(instructions || "-");

    doc.moveDown(4);

    /* ASSINATURA */
    doc.text(
      "__________________________________",
      {
        align: "center",
      }
    );

    doc.text(
      `${doctorName} - CRM ${crm}`,
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Erro ao gerar prescrição",
    });
  }
});

export default router;