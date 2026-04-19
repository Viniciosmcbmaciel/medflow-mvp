import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { date, date_from, date_to, professionalId } = req.query;

    const where: any = {};

    if (date && typeof date === "string") {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    if (date_from && date_to && typeof date_from === "string" && typeof date_to === "string") {
      const start = new Date(date_from);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date_to);
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

    const appointmentDate = new Date(date);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        professionalId: professionalId || null,
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

    if (appointmentType === "CONVENIO" && !insuranceName?.trim()) {
      return res.status(400).json({
        error: "Informe o nome do convênio para consultas por convênio.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        professionalId: professionalId || null,
        date: appointmentDate,
        notes,
        status,
        appointmentType: appointmentType || "PARTICULAR",
        insuranceName:
          appointmentType === "CONVENIO" ? insuranceName?.trim() : null,
      },
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar consulta" });
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

    const appointmentDate = date ? new Date(date) : undefined;

    if (appointmentDate) {
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          date: appointmentDate,
          professionalId: professionalId || null,
          status: {
            not: "CANCELED",
          },
        },
      });

      if (existingAppointment) {
        return res.status(400).json({
          error: "Já existe outra consulta agendada para este médico neste horário.",
        });
      }
    }

    if (appointmentType === "CONVENIO" && !insuranceName?.trim()) {
      return res.status(400).json({
        error: "Informe o nome do convênio para consultas por convênio.",
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        patientId,
        professionalId: professionalId || null,
        date: appointmentDate,
        notes,
        status,
        appointmentType: appointmentType || "PARTICULAR",
        insuranceName:
          appointmentType === "CONVENIO" ? insuranceName?.trim() : null,
      },
    });

    return res.json(appointment);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar consulta" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    return res.json({ message: "Consulta removida com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir consulta" });
  }
});

export default router;