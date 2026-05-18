import express from "express";

import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

import patientRoutes from "./routes/patients.routes.js";

import medicalRecordRoutes from "./routes/medical-records.routes.js";

import prescriptionsRoutes from "./routes/prescriptions.routes.js";

const app = express();

/* =========================================
   CONFIG
========================================= */

app.use(cors());

app.use(express.json());

/* =========================================
   TESTE API
========================================= */

app.get("/", (_req, res) => {
  return res.json({
    ok: true,
    name: "MedFlow API",
  });
});

/* =========================================
   ROUTES
========================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/patients",
  patientRoutes
);

app.use(
  "/api/medical-records",
  medicalRecordRoutes
);

app.use(
  "/api/prescriptions",
  prescriptionsRoutes
);

/* =========================================
   PORT
========================================= */

const PORT =
  process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});