import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/:documentId/pdf', async (req, res) => {
  const document = await prisma.document.findUnique({
    where: { id: req.params.documentId },
    include: {
      signature: true,
      medicalRecord: {
        include: {
          patient: true,
          professional: true,
        },
      },
    },
  });

  if (!document) {
    return res.status(404).json({ message: 'Documento não encontrado.' });
  }

  const pdf = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=document-${document.id}.pdf`);
  pdf.pipe(res);

  pdf.fontSize(18).text('MedFlow - Documento Clínico', { align: 'center' });
  pdf.moveDown();
  pdf.fontSize(12).text(`Tipo: ${document.type}`);
  pdf.text(`Paciente: ${document.medicalRecord.patient.fullName}`);
  pdf.text(`Profissional: ${document.medicalRecord.professional.name}`);
  pdf.text(`Criado em: ${document.createdAt.toLocaleString('pt-BR')}`);
  pdf.moveDown();
  pdf.text('Conteúdo:');
  pdf.fontSize(10).text(document.content);
  pdf.moveDown();

  if (document.signature) {
    pdf.fontSize(12).text('Assinatura digital interna');
    pdf.fontSize(10).text(`Assinado por: ${document.signature.signedBy}`);
    pdf.text(`Data/hora: ${document.signature.signedAt.toLocaleString('pt-BR')}`);
    pdf.text(`Hash: ${document.signature.hash}`);
  } else {
    pdf.text('Documento ainda não assinado.');
  }

  pdf.end();
});

export default router;
