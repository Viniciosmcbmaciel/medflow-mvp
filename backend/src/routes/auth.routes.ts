import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";
import { createAuditLog } from "../utils/audit.js";
import { sendResetPasswordEmail } from "../utils/mail.js";

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

router.post("/forgot-password", async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "E-mail inválido.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return res.json({
        message: "Se o e-mail existir, enviaremos um link de redefinição.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const resetBaseUrl =
      process.env.RESET_PASSWORD_URL ||
      "http://localhost:3000/redefinir-senha";

    const resetLink = `${resetBaseUrl}?token=${token}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.json({
      message: "Se o e-mail existir, enviaremos um link de redefinição.",
    });
  } catch (error) {
    console.error("Erro em /auth/forgot-password:", error);
    return res.status(500).json({
      message: "Erro ao solicitar redefinição de senha.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const schema = z.object({
      token: z.string().min(10),
      password: z.string().min(6),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Token e nova senha são obrigatórios.",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: parsed.data.token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Link inválido ou expirado.",
      });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    try {
      await createAuditLog({
        userId: user.id,
        action: "RESET_PASSWORD",
        entity: "USER",
        entityId: user.id,
        ipAddress: req.ip,
      });
    } catch (auditError) {
      console.error("Erro ao registrar auditoria:", auditError);
    }

    return res.json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    console.error("Erro em /auth/reset-password:", error);
    return res.status(500).json({
      message: "Erro ao redefinir senha.",
    });
  }
});

export default router;