import express from "express";

import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import examsRoutes from "./routes/exams.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { authMiddleware } from "./middleware/auth.js";

const app = express();

/**
 * 🔐 CORS MANUAL (100% compatível com Vercel + Railway)
 */
const allowedOrigins = [
  "http://localhost:3000",
  "https://medflow-mvp.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 🚨 MUITO IMPORTANTE → responde preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

/**
 * 🔓 ROTAS PÚBLICAS
 */
app.use("/auth", authRoutes);

/**
 * 🧪 ROTA DE TESTE (IMPORTANTE)
 */
app.get("/health", (_req, res) => {
  res.json({ ok: true, cors: "ok-v3" });
});

/**
 * 🔐 IGNORA OPTIONS NO AUTH
 */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

/**
 * 🔐 ROTAS PROTEGIDAS
 */
app.use(authMiddleware);

app.use("/patients", patientsRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/prescriptions", prescriptionsRoutes);
app.use("/exams", examsRoutes);
app.use("/users", usersRoutes);

export default app;