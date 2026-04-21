import express from "express";
import cors, { CorsOptions } from "cors";

import authRoutes from "./routes/auth.routes.js";
import patientsRoutes from "./routes/patients.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import medicalRecordsRoutes from "./routes/medical-records.routes.js";
import prescriptionsRoutes from "./routes/prescriptions.routes.js";
import examsRoutes from "./routes/exams.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { authMiddleware } from "./middleware/auth.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://medflow-mvp.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed =
      allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);

app.use(authMiddleware);

app.use("/patients", patientsRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/medical-records", medicalRecordsRoutes);
app.use("/prescriptions", prescriptionsRoutes);
app.use("/exams", examsRoutes);
app.use("/users", usersRoutes);

export default app;