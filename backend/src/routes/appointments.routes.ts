import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

function isValidDate(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

router.get("/", async (req, res) => {
  try {
    const { date, date_from, date_to, professionalId } = req.query;

    const where: any = {};

    if (date && typeof date === "string") {
      const start = new Date(date);
      const end = new Date(date);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    if (
      date_from &&
      date_to &&
      typeof date_from === "string" &&
      typeof date_to === "string"
    ) {
      const start = new Date(date_from);
      const end = new Date(date_to);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    if (professionalId && typeof professionalId === "string") {
      where.professionalId = professionalId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return res.json(appointments);
  } catch (error) {
    console.error("Erro ao listar consultas:", error);
    return res.status(500).json({ error: "Erro ao listar consultas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      professionalId,
      date,
      notes,
      status,
      appointmentType,
      insuranceName,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "Paciente é obrigatório." });
    }

    if (!professionalId) {
      return res.status(400).json({ error: "Médico é obrigatório." });
    }

    if (!date || !isValidDate(date)) {
      return res.status(400).json({ error: "Data e hora inválidas." });
    }

    const finalAppointmentType = appointmentType || "PARTICULAR";

    if (
      finalAppointmentType === "CONVENIO" &&
      !String(insuranceName || "").trim()
    ) {
      return res.status(400).json({
        error: "Informe o nome do convênio para consultas por convênio.",
      });
    }

    const appointmentDate = new Date(date);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        professionalId,
        status: {
          not: "CANCELED",
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: "Já existe uma consulta agendada para este médico neste horário.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        professionalId,
        date: appointmentDate,
        notes: notes || null,
        status: status || "SCHEDULED",
        appointmentType: finalAppointmentType,
        insuranceName:
          finalAppointmentType === "CONVENIO"
            ? String(insuranceName || "").trim()
            : null,
      },
      include: {
        patient: true,
      },
    });

    return res.status(201).json(appointment);
  } catch (error: any) {
    console.error("Erro ao criar consulta:", error);

    return res.status(500).json({
      error: error?.message || "Erro ao criar consulta",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      patientId,
      professionalId,
      date,
      notes,
      status,
      appointmentType,
      insuranceName,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "Paciente é obrigatório." });
    }

    if (!professionalId) {
      return res.status(400).json({ error: "Médico é obrigatório." });
    }

    if (!date || !isValidDate(date)) {
      return res.status(400).json({ error: "Data e hora inválidas." });
    }

    const finalAppointmentType = appointmentType || "PARTICULAR";

    if (
      finalAppointmentType === "CONVENIO" &&
      !String(insuranceName || "").trim()
    ) {
      return res.status(400).json({
        error: "Informe o nome do convênio para consultas por convênio.",
      });
    }

    const appointmentDate = new Date(date);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        date: appointmentDate,
        professionalId,
        status: {
          not: "CANCELED",
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        error:
          "Já existe outra consulta agendada para este médico neste horário.",
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        patientId,
        professionalId,
        date: appointmentDate,
        notes: notes || null,
        status: status || "SCHEDULED",
        appointmentType: finalAppointmentType,
        insuranceName:
          finalAppointmentType === "CONVENIO"
            ? String(insuranceName || "").trim()
            : null,
      },
      include: {
        patient: true,
      },
    });

    return res.json(appointment);
  } catch (error: any) {
    console.error("Erro ao atualizar consulta:", error);

    return res.status(500).json({
      error: error?.message || "Erro ao atualizar consulta",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    return res.json({ message: "Consulta removida com sucesso" });
  } catch (error: any) {
    console.error("Erro ao excluir consulta:", error);

    return res.status(500).json({
      error: error?.message || "Erro ao excluir consulta",
    });
  }
});

export default router;