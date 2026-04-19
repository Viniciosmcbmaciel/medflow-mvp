import PDFDocument from "pdfkit";
import { Response } from "express";

type PdfLine = {
  label: string;
  value: string;
};

type PdfMeta = {
  professionalName?: string;
  professionalCrm?: string;
  signed?: boolean;
  signedBy?: string;
};

function drawHeader(doc: PDFKit.PDFDocument, title: string) {
  doc
    .fontSize(22)
    .fillColor("#166534")
    .text("MedFlow Clinic", { align: "center" });

  doc
    .moveDown(0.3)
    .fontSize(11)
    .fillColor("#4b5563")
    .text("Sistema de Prontuário Eletrônico", { align: "center" });

  doc.moveDown(1);

  doc
    .strokeColor("#16a34a")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1);

  doc
    .fontSize(18)
    .fillColor("#111827")
    .text(title, { align: "left" });

  doc.moveDown(1);
}

function drawField(doc: PDFKit.PDFDocument, label: string, value: string) {
  doc
    .fontSize(12)
    .fillColor("#166534")
    .font("Helvetica-Bold")
    .text(label);

  doc
    .moveDown(0.2)
    .fontSize(11)
    .fillColor("#111827")
    .font("Helvetica")
    .text(value || "—", {
      align: "left",
      lineGap: 2,
    });

  doc.moveDown(0.8);
}

function drawProfessionalSection(doc: PDFKit.PDFDocument, meta?: PdfMeta) {
  doc.moveDown(1);

  doc
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1);

  doc
    .fontSize(12)
    .fillColor("#166534")
    .font("Helvetica-Bold")
    .text("Responsável pelo documento");

  doc.moveDown(0.4);

  doc
    .fontSize(11)
    .fillColor("#111827")
    .font("Helvetica")
    .text(`Profissional: ${meta?.professionalName || "Médico responsável"}`);

  doc.text(`CRM: ${meta?.professionalCrm || "CRM não informado"}`);

  doc.text(
    `Status da assinatura: ${meta?.signed ? "Assinado digitalmente" : "Não assinado"}`
  );

  if (meta?.signedBy) {
    doc.text(`Assinado por: ${meta.signedBy}`);
  }

  doc.moveDown(1.2);

  doc
    .strokeColor("#9ca3af")
    .lineWidth(1)
    .moveTo(180, doc.y)
    .lineTo(420, doc.y)
    .stroke();

  doc.moveDown(0.3);

  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(meta?.professionalName || "Médico responsável", {
      align: "center",
    });
}

function drawFooter(doc: PDFKit.PDFDocument) {
  doc.moveDown(1.2);

  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(`Documento gerado em: ${new Date().toLocaleString("pt-BR")}`, {
      align: "right",
    });
}

export function generateSimplePdf(
  res: Response,
  title: string,
  lines: PdfLine[],
  fileName: string,
  meta?: PdfMeta
) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

  doc.pipe(res);

  drawHeader(doc, title);

  lines.forEach((line) => {
    drawField(doc, line.label, line.value);
  });

  drawProfessionalSection(doc, meta);
  drawFooter(doc);

  doc.end();
}