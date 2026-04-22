import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { createAuditLog } from "../utils/audit.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        medicalRecords: {
          include: { anamnesis: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.json(patients);
  } catch (error) {
    console.error("Erro ao listar pacientes:", error);
    return res.status(500).json({ message: "Erro ao carregar pacientes." });
  }
});

router.post("/", async (req, res) => {
  try {
    const schema = z.object({
      fullName: z.string().min(3),
      cpf: z.string().optional().or(z.literal("")),
      birthDate: z.string().optional().or(z.literal("")),
      phone: z.string().optional().or(z.literal("")),
      email: z.string().email().optional().or(z.literal("")),
      address: z.string().optional().or(z.literal("")),
      allergies: z.string().optional().or(z.literal("")),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: parsed.error.flatten(),
      });
    }

    const data = parsed.data;

    const patient = await prisma.patient.create({
      data: {
        fullName: data.fullName,
        cpf: data.cpf || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        allergies: data.allergies || null,
      },
    });

    try {
      await createAuditLog({
        userId: req.user?.id,
        action: "CREATE",
        entity: "PATIENT",
        entityId: patient.id,
        details: `Paciente ${patient.fullName} criado`,
        ipAddress: req.ip,
      });
    } catch (auditError) {
      console.error("Erro ao registrar auditoria do paciente:", auditError);
    }

    return res.status(201).json(patient);
  } catch (error: any) {
    console.error("Erro ao cadastrar paciente:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        message: "Já existe paciente com esse CPF ou e-mail.",
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar paciente.",
    });
  }
});

export default router;