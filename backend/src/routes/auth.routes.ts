import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";
import { createAuditLog } from "../utils/audit.js";
import { sendResetPasswordEmail } from "../utils/mail.js";

const router = Router();

/* =========================================
   TESTE
========================================= */
router.get("/ping", (_req, res) => {
  return res.json({
    ok: true,
    route: "auth",
  });
});

/* =========================================
   LOGIN
========================================= */
router.post("/login", async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Dados inválidos.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
      });
    }

    /* =========================================
       SUPORTE A password E passwordHash
    ========================================= */
    const userPassword =
      user.passwordHash || user.password;

    if (!userPassword) {
      return res.status(500).json({
        message:
          "Senha do usuário inválida.",
      });
    }

    const validPassword =
      await bcrypt.compare(
        parsed.data.password,
        userPassword
      );

    if (!validPassword) {
      return res.status(401).json({
        message: "Senha inválida.",
      });
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
      console.error(
        "Erro auditoria:",
        auditError
      );
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
    console.error(
      "Erro login:",
      error
    );

    return res.status(500).json({
      message:
        "Erro interno ao fazer login.",
    });
  }
});

/* =========================================
   ESQUECI SENHA
========================================= */
router.post(
  "/forgot-password",
  async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
      });

      const parsed =
        schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "E-mail inválido.",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

      if (!user) {
        return res.json({
          message:
            "Se o e-mail existir enviaremos o link.",
        });
      }

      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      const expires = new Date(
        Date.now() +
          1000 * 60 * 60
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          resetPasswordToken: token,
          resetPasswordExpires:
            expires,
        },
      });

      const resetBaseUrl =
        process.env
          .RESET_PASSWORD_URL ||
        "http://localhost:3000/redefinir-senha";

      const resetLink =
        `${resetBaseUrl}?token=${token}`;

      await sendResetPasswordEmail(
        user.email,
        resetLink
      );

      return res.json({
        message:
          "Link enviado com sucesso.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao solicitar redefinição.",
      });
    }
  }
);

/* =========================================
   RESETAR SENHA
========================================= */
router.post(
  "/reset-password",
  async (req, res) => {
    try {
      const schema = z.object({
        token: z.string(),
        password:
          z.string().min(6),
      });

      const parsed =
        schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message:
            "Dados inválidos.",
        });
      }

      const user =
        await prisma.user.findFirst({
          where: {
            resetPasswordToken:
              parsed.data.token,

            resetPasswordExpires: {
              gt: new Date(),
            },
          },
        });

      if (!user) {
        return res.status(400).json({
          message:
            "Token inválido ou expirado.",
        });
      }

      const passwordHash =
        await bcrypt.hash(
          parsed.data.password,
          10
        );

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          passwordHash,
          resetPasswordToken:
            null,
          resetPasswordExpires:
            null,
        },
      });

      return res.json({
        message:
          "Senha redefinida com sucesso.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Erro ao redefinir senha.",
      });
    }
  }
);

export default router;