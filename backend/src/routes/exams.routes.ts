import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { createAuditLog } from "../utils/audit.js";
import { generateSimplePdf } from "../utils/pdf.js";

const router = Router();

router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const exams = await prisma.examOrder.findMany({
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
    });

    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar exames." });
  }
});

router.post("/", async (req, res) => {
  const schema = z.object({
    medicalRecordId: z.string(),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          examName: z.string().min(1),
          justification: z.string().optional(),
        })
      )
      .min(1),
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos." });
  }

  try {
    const examOrder = await prisma.examOrder.create({
      data: {
        medicalRecordId: parsed.data.medicalRecordId,
        notes: parsed.data.notes,
        items: {
          create: parsed.data.items,
        },
      },
      include: {
        items: true,
        medicalRecord: true,
      },
    });

    await createAuditLog({
      userId: req.user?.id,
      action: "CREATE",
      entity: "EXAM_ORDER",
      entityId: examOrder.id,
      ipAddress: req.ip,
    });

    return res.status(201).json(examOrder);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar solicitação de exame." });
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const examOrder = await prisma.examOrder.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        medicalRecord: {
          include: {
            patient: true,
            user: true,
          },
        },
      },
    });

    if (!examOrder) {
      return res.status(404).json({ message: "Solicitação de exame não encontrada." });
    }

    const itemsText = examOrder.items
      .map(
        (item, index) =>
          `${index + 1}. Exame: ${item.examName}\nJustificativa: ${item.justification || "—"}`
      )
      .join("\n\n");

    return generateSimplePdf(
      res,
      "Solicitação de Exames",
      [
        { label: "Paciente", value: examOrder.medicalRecord.patient.fullName },
        {
          label: "Data da solicitação",
          value: new Date(examOrder.createdAt).toLocaleString("pt-BR"),
        },
        { label: "Exames solicitados", value: itemsText || "—" },
        { label: "Observações", value: examOrder.notes || "—" },
      ],
      `exames-${examOrder.id}.pdf`,
      {
        professionalName: "Médico responsável",
        professionalCrm: "CRM 000000",
        signed: false,
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Erro ao gerar PDF do exame." });
  }
});

export default router;