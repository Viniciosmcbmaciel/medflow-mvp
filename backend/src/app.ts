import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    status: "ok",
    message: "MedFlow API running",
  });
});

/* =========================================
   ROUTES
========================================= */

app.use("/auth", authRoutes);

app.use("/patients", patientsRoutes);

app.use("/appointments", appointmentsRoutes);

app.use("/prescriptions", prescriptionsRoutes);

app.use(
  "/medical-records",
  medicalRecordsRoutes
);

export default app;