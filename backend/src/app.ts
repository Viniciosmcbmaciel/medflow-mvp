import express from "express";

import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import prescriptionPdfRoutes from "./routes/prescription-pdf.routes.js";
import examsRoutes from "./routes/exams.routes.js";
import usersRoutes from "./routes/users.routes.js";

import medicalEvolutionRoutes from "./routes/medical-evolution.routes.js";

import { authMiddleware } from "./middleware/auth.js";

const app = express();

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

app.use((req, res, next) => {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.options("/auth/login", (req, res) => {
  applyCors(req, res);

  return res.sendStatus(204);
});

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API online");
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    version: "v4-medflow",
  });
});


/* LOGIN */
app.use("/auth", authRoutes);

/* PDF PRESCRIÇÃO */
app.use(
  "/prescription-pdf",
  prescriptionPdfRoutes
);

app.use(authMiddleware);

/* PACIENTES */
app.use("/patients", patientsRoutes);

/* AGENDA */
app.use(
  "/appointments",
  appointmentsRoutes
);

/* PRONTUÁRIO */
app.use(
  "/medical-records",
  medicalRecordsRoutes
);

/* EVOLUÇÃO */
app.use(
  "/medical-evolutions",
  medicalEvolutionRoutes
);

/* PRESCRIÇÕES */
app.use(
  "/prescriptions",
  prescriptionsRoutes
);

/* EXAMES */
app.use("/exams", examsRoutes);

/* USUÁRIOS */
app.use("/users", usersRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});

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