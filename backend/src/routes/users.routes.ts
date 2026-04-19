import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

function ensureAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Apenas administradores podem acessar esta rota." });
  }

  next();
}

router.get("/", ensureAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crm: true,
        specialty: true,
        createdAt: true,
      },
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

router.get("/medicos", async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "MEDICO" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        crm: true,
        specialty: true,
      },
    });

    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar médicos." });
  }
});

router.post("/", ensureAdmin, async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "MEDICO", "SECRETARIA"]),
    crm: z.string().optional(),
    specialty: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos." });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
        crm: parsed.data.role === "MEDICO" ? parsed.data.crm || null : null,
        specialty:
          parsed.data.role === "MEDICO" ? parsed.data.specialty || null : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        crm: true,
        specialty: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar usuário." });
  }
});

export default router;