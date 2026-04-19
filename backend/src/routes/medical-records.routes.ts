import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateSimplePdf } from "../utils/pdf.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar prontuários" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      chiefComplaint,
      historyPresentIllness,
      medications,
      physicalExam,
      conduct,
      notes,
    } = req.body;

    if (!patientId || !chiefComplaint) {
      return res.status(400).json({
        error: "Paciente e queixa principal são obrigatórios.",
      });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        chiefComplaint,
        historyPresentIllness,
        medications,
        physicalExam,
        conduct,
        notes,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar prontuário" });
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const { id } = req.params;

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
        user: true,
      },
    });

    if (!record) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    return generateSimplePdf(
      res,
      "Evolução Clínica / Prontuário",
      [
        { label: "Paciente", value: record.patient.fullName },
        {
          label: "Data do registro",
          value: new Date(record.createdAt).toLocaleString("pt-BR"),
        },
        { label: "Queixa principal", value: record.chiefComplaint || "—" },
        {
          label: "História da doença atual",
          value: record.historyPresentIllness || "—",
        },
        { label: "Medicamentos em uso", value: record.medications || "—" },
        { label: "Exame físico", value: record.physicalExam || "—" },
        { label: "Conduta", value: record.conduct || "—" },
        { label: "Observações", value: record.notes || "—" },
      ],
      `prontuario-${record.id}.pdf`,
      {
        professionalName: record.user?.name || "Médico responsável",
        professionalCrm: "CRM 000000",
        signed: false,
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Erro ao gerar PDF do prontuário." });
  }
});

export default router;