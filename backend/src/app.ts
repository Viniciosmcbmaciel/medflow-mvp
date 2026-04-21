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

const allowedOrigins = new Set([
  "http://localhost:3000",
  "https://medflow-mvp.vercel.app",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && (allowedOrigins.has(origin) || origin.endsWith(".vercel.app"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
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
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API online");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, cors: "manual-v4" });
});

app.use("/auth", authRoutes);

app.use(authMiddleware);

app.use("/patients", patientsRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/prescriptions", prescriptionsRoutes);
app.use("/exams", examsRoutes);
app.use("/users", usersRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;