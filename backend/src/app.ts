import express from "express";

import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import prescriptionPdfRoutes from "./routes/prescription-pdf.routes.js"; // ✅ NOVA ROTA PDF
import examsRoutes from "./routes/exams.routes.js";
import usersRoutes from "./routes/users.routes.js";

/* ✅ EVOLUÇÃO CLÍNICA */
import medicalEvolutionRoutes from "./routes/medical-evolution.routes.js";

import { authMiddleware } from "./middleware/auth.js";

const app = express();

/* ========================================
   CORS PROFISSIONAL
======================================== */
function applyCors(
  req: express.Request,
  res: express.Response
) {
  const origin = req.headers.origin;

  if (
    origin &&
    (
      origin === "http://localhost:3000" ||
      origin.endsWith(".vercel.app")
    )
  ) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin
    );
  } else {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );
  }

  res.setHeader("Vary", "Origin");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

/* ========================================
   MIDDLEWARE GLOBAL CORS
======================================== */
app.use((req, res, next) => {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ========================================
   PREFLIGHT LOGIN
======================================== */
app.options("/auth/login", (req, res) => {
  applyCors(req, res);

  return res.sendStatus(204);
});

/* ========================================
   JSON BODY
======================================== */
app.use(express.json());

/* ========================================
   HEALTH CHECK
======================================== */
app.get("/", (_req, res) => {
  res.send("API online");
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    version: "v3-medflow",
  });
});

/* ========================================
   ROTAS PÚBLICAS
======================================== */
app.use("/auth", authRoutes);

/* ========================================
   JWT AUTH
======================================== */
app.use(authMiddleware);

/* ========================================
   ROTAS PROTEGIDAS
======================================== */

// 👤 Pacientes
app.use("/patients", patientsRoutes);

// 📅 Agenda
app.use("/appointments", appointmentsRoutes);

// 🩺 Prontuário eletrônico
app.use(
  "/medical-records",
  medicalRecordsRoutes
);

// 📈 Evolução clínica premium
app.use(
  "/medical-evolutions",
  medicalEvolutionRoutes
);

// 💊 Prescrições
app.use(
  "/prescriptions",
  prescriptionsRoutes
);

// 📄 Prescrição PDF premium
app.use(
  "/prescription-pdf",
  prescriptionPdfRoutes
);

// 🧪 Exames
app.use("/exams", examsRoutes);

// 👨‍⚕️ Usuários/Médicos
app.use("/users", usersRoutes);

/* ========================================
   404
======================================== */
app.use((_req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});

/* ========================================
   ERRO GLOBAL
======================================== */
app.use(
  (
    err: any,
    _req: any,
    res: any,
    _next: any
  ) => {
    console.error(
      "Erro interno:",
      err
    );

    res.status(500).json({
      error:
        "Erro interno do servidor",
    });
  }
);

export default app;