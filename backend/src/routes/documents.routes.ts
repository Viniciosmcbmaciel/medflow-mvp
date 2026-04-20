import { Router } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/:id/pdf", async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        medicalRecord: {
          include: {
            patient: true,
          },
        },
        signature: true,
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Documento não encontrado." });
    }

    const pdf = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="documento-${document.id}.pdf"`
    );

    pdf.pipe(res);

    pdf.fontSize(20).text("Documento Clínico", { align: "center" });
    pdf.moveDown();

    pdf.fontSize(12).text(`Tipo: ${document.type}`);
    pdf.text(`Paciente: ${document.medicalRecord.patient.fullName}`);
    pdf.text(
      `Data de criação: ${new Date(document.createdAt).toLocaleString("pt-BR")}`
    );
    pdf.moveDown();

    pdf.fontSize(14).text("Conteúdo", { underline: true });
    pdf.moveDown(0.5);
    pdf.fontSize(12).text(document.content || "Sem conteúdo.");
    pdf.moveDown();

    if (document.signature) {
      pdf.fontSize(14).text("Assinatura Digital", { underline: true });
      pdf.moveDown(0.5);
      pdf.fontSize(10).text(`Assinado por: ${document.signature.signedBy}`);
      pdf.text(
        `Data/hora: ${new Date(document.signature.signedAt).toLocaleString(
          "pt-BR"
        )}`
      );
      pdf.text(`Hash: ${document.signature.hash}`);
    }

    pdf.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar PDF do documento." });
  }
});

export default router;