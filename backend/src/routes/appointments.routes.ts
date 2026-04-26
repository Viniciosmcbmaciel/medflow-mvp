import { Router } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../config/prisma.js";

const router = Router();

function isValidDate(value: string) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function getAppointmentStatusLabel(status: string) {
  switch (status) {
    case "SCHEDULED":
      return "Agendada";
    case "CONFIRMED":
      return "Confirmada";
    case "CANCELED":
      return "Cancelada";
    case "COMPLETED":
      return "Concluída";
    default:
      return status;
  }
}

function getAppointmentTypeLabel(type: string) {
  return type === "CONVENIO" ? "Convênio" : "Particular";
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

router.get("/pdf", async (req, res) => {
  try {
    const { date_from, date_to, professionalId } = req.query;

    const where: any = {};

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

    const professionalIds = appointments
      .map((appointment) => appointment.professionalId)
      .filter(Boolean) as string[];

    const professionals = await prisma.user.findMany({
      where: {
        id: {
          in: professionalIds,
        },
      },
      select: {
        id: true,
        name: true,
        crm: true,
        specialty: true,
      },
    });

    const professionalsMap = new Map(
      professionals.map((professional) => [professional.id, professional])
    );

    const pdf = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="agenda-medflow.pdf"'
    );

    pdf.pipe(res);

    pdf
      .fontSize(22)
      .fillColor("#166534")
      .text("MedFlow", { align: "center" });

    pdf
      .fontSize(15)
      .fillColor("#111827")
      .text("Agenda de Consultas", { align: "center" });

    pdf.moveDown(0.5);

    pdf
      .fontSize(10)
      .fillColor("#4b5563")
      .text(`Período: ${date_from || "—"} até ${date_to || "—"}`, {
        align: "center",
      });

    pdf.moveDown(1.5);

    if (appointments.length === 0) {
      pdf
        .fontSize(12)
        .fillColor("#111827")
        .text("Nenhuma consulta encontrada para o período.");
    }

    appointments.forEach((appointment, index) => {
      if (pdf.y > 700) {
        pdf.addPage();
      }

      const professional = appointment.professionalId
        ? professionalsMap.get(appointment.professionalId)
        : null;

      pdf
        .roundedRect(40, pdf.y, 515, 118, 8)
        .strokeColor("#e5e7eb")
        .stroke();

      const startY = pdf.y + 12;

      pdf
        .fontSize(12)
        .fillColor("#111827")
        .text(`${index + 1}. ${appointment.patient.fullName}`, 52, startY);

      pdf
        .fontSize(9)
        .fillColor("#4b5563")
        .text(
          `Data/Hora: ${new Date(appointment.date).toLocaleString("pt-BR")}`,
          52,
          startY + 20
        )
        .text(`CPF: ${appointment.patient.cpf || "—"}`, 52, startY + 36)
        .text(`Telefone: ${appointment.patient.phone || "—"}`, 52, startY + 52)
        .text(`E-mail: ${appointment.patient.email || "—"}`, 52, startY + 68);

      pdf
        .fontSize(9)
        .fillColor("#4b5563")
        .text(
          `Médico: ${
            professional
              ? `${professional.name}${
                  professional.crm ? ` - CRM ${professional.crm}` : ""
                }`
              : "—"
          }`,
          300,
          startY + 20
        )
        .text(`Especialidade: ${professional?.specialty || "—"}`, 300, startY + 36)
        .text(`Status: ${getAppointmentStatusLabel(appointment.status)}`, 300, startY + 52)
        .text(`Tipo: ${getAppointmentTypeLabel(appointment.appointmentType)}`, 300, startY + 68)
        .text(`Convênio: ${appointment.insuranceName || "—"}`, 300, startY + 84);

      if (appointment.notes) {
        pdf
          .fontSize(9)
          .fillColor("#4b5563")
          .text(`Observações: ${appointment.notes}`, 52, startY + 88, {
            width: 230,
          });
      }

      pdf.moveDown(7);
    });

    pdf.end();
  } catch (error) {
    console.error("Erro ao gerar PDF da agenda:", error);
    return res.status(500).json({ error: "Erro ao gerar PDF da agenda" });
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