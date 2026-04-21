import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";
import { createAuditLog } from "../utils/audit.js";

const router = Router();

router.get("/ping", (_req, res) => {
  return res.json({ ok: true, route: "auth" });
});

router.post("/login", async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: parsed.error.flatten(),
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // auditoria não pode derrubar o login
    try {
      await createAuditLog({
        userId: user.id,
        action: "LOGIN",
        entity: "USER",
        entityId: user.id,
        ipAddress: req.ip,
      });
    } catch (auditError) {
      console.error("Erro ao registrar auditoria:", auditError);
    }

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro na rota /auth/login:", error);
    return res.status(500).json({
      message: "Erro interno ao fazer login.",
    });
  }
});

export default router;