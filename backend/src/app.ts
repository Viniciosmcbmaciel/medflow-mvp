import express from "express";

// Rotas
import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import examsRoutes from "./routes/exams.routes.js";
import usersRoutes from "./routes/users.routes.js";

// Middleware
import { authMiddleware } from "./middleware/auth.js";

const app = express();

// 🔥 CORS (colocar SEMPRE antes de tudo)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 🔥 resolve preflight (erro que você tinha)
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// Middlewares base
app.use(express.json());

// ✅ Rota de saúde
app.get("/health", (_req, res) => {
  res.json({ ok: true, cors: "fixed-final" });
});

// Rotas públicas
app.use("/auth", authRoutes);

// 🔐 Rotas protegidas
app.use(authMiddleware);

app.use("/patients", patientsRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/prescriptions", prescriptionsRoutes);
app.use("/exams", examsRoutes);
app.use("/users", usersRoutes);

// ❌ fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// ❌ erro global (evita crash no Railway)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Erro interno:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;