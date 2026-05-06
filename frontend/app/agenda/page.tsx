"use client";

import { useEffect, useState } from "react";

import AppHeader from "../../components/AppHeader";
import AppointmentModal from "../../components/AppointmentModal";
import MedicalEvolutionModal from "../../components/MedicalEvolutionModal";

import { useRequireAuth } from "../../lib/auth";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBrLocale from "@fullcalendar/core/locales/pt-br";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("medflow_token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

const statusColor: any = {
  SCHEDULED: "#3b82f6",
  CONFIRMED: "#22c55e",
  CANCELED: "#ef4444",
  COMPLETED: "#8b5cf6",
};

export default function AgendaPage() {
  const { ready } = useRequireAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState("");

  const [selectedPatient, setSelectedPatient] =
    useState<any>(null);

  async function loadAll() {
    try {
      const [apptRes, pRes, dRes] =
        await Promise.all([
          fetch(`${API_URL}/appointments`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_URL}/patients`, {
            headers: getAuthHeaders(),
          }),

          fetch(`${API_URL}/users/medicos`, {
            headers: getAuthHeaders(),
          }),
        ]);

      const appts = await apptRes.json();

      const filtered = selectedDoctor
        ? appts.filter(
            (a: any) =>
              a.professionalId ===
              selectedDoctor
          )
        : appts;

      setAppointments(filtered);

      setEvents(
        filtered.map((a: any) => ({
          id: a.id,

          title: a.patient.fullName,

          start: a.date,

          end: new Date(
            new Date(a.date).getTime() +
              30 * 60000
          ),

          backgroundColor:
            statusColor[a.status],

          borderColor:
            statusColor[a.status],

          extendedProps: {
            patient: a.patient,
            appointment: a,
          },
        }))
      );

      setPatients(await pRes.json());

      setDoctors(await dRes.json());
    } catch (error) {
      console.error(error);

      alert("Erro ao carregar agenda");
    }
  }

  useEffect(() => {
    if (ready) {
      loadAll();
    }
  }, [ready, selectedDoctor]);

  function handleSelect(info: any) {
    setSelectedDate(info.startStr);

    setModalOpen(true);
  }

  async function handleCreate({
    patientId,
    doctorId,
  }: any) {
    try {
      const res = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            patientId,

            professionalId: doctorId,

            date: selectedDate,

            status: "SCHEDULED",

            appointmentType:
              "PARTICULAR",
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Erro ao criar consulta"
        );
      }

      setModalOpen(false);

      loadAll();
    } catch (error) {
      console.error(error);

      alert("Erro ao criar consulta");
    }
  }

  async function updateStatus(
    appointment: any,
    status: string
  ) {
    try {
      const res = await fetch(
        `${API_URL}/appointments/${appointment.id}`,
        {
          method: "PUT",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            patientId:
              appointment.patientId,

            professionalId:
              appointment.professionalId,

            date: appointment.date,

            notes: appointment.notes,

            appointmentType:
              appointment.appointmentType,

            insuranceName:
              appointment.insuranceName,

            status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Erro ao atualizar status"
        );
      }

      loadAll();
    } catch (error) {
      console.error(error);

      alert("Erro ao atualizar status");
    }
  }

  async function deleteAppointment(
    id: string
  ) {
    const confirmed = confirm(
      "Deseja excluir esta consulta?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/appointments/${id}`,
        {
          method: "DELETE",

          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Erro ao excluir consulta"
        );
      }

      loadAll();
    } catch (error) {
      console.error(error);

      alert("Erro ao excluir consulta");
    }
  }

  async function handleDrop(info: any) {
    try {
      const appointment =
        appointments.find(
          (a) => a.id === info.event.id
        );

      if (!appointment) return;

      const res = await fetch(
        `${API_URL}/appointments/${info.event.id}`,
        {
          method: "PUT",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            patientId:
              appointment.patientId,

            professionalId:
              appointment.professionalId,

            notes: appointment.notes,

            appointmentType:
              appointment.appointmentType,

            insuranceName:
              appointment.insuranceName,

            status: appointment.status,

            date: info.event.start,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Erro ao mover consulta"
        );
      }

      loadAll();
    } catch (error) {
      console.error(error);

      alert("Erro ao mover consulta");
    }
  }

  function handleEventClick(info: any) {
    const appointment =
      info.event.extendedProps
        .appointment;

    const action = prompt(
      `Paciente: ${info.event.title}

1 - Confirmar
2 - Concluir
3 - Cancelar
4 - Excluir
5 - Abrir prontuário`
    );

    if (!action) return;

    if (action === "1") {
      updateStatus(
        appointment,
        "CONFIRMED"
      );
    }

    if (action === "2") {
      updateStatus(
        appointment,
        "COMPLETED"
      );
    }

    if (action === "3") {
      updateStatus(
        appointment,
        "CANCELED"
      );
    }

    if (action === "4") {
      deleteAppointment(
        appointment.id
      );
    }

    if (action === "5") {
      setSelectedPatient(
        appointment.patient
      );
    }
  }

  if (!ready) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main
        style={{
          display: "flex",
          height:
            "calc(100vh - 80px)",
          background: "#f8fafc",
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: 280,

            borderRight:
              "1px solid #e2e8f0",

            padding: 20,

            background: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              marginBottom: 20,
            }}
          >
            Agenda Médica
          </h2>

          <div>
            <label
              style={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Filtrar médico
            </label>

            <select
              style={{
                width: "100%",
                marginTop: 8,
                padding: 10,
                borderRadius: 12,
                border:
                  "1px solid #dbeafe",
              }}
              value={selectedDoctor}
              onChange={(e) =>
                setSelectedDoctor(
                  e.target.value
                )
              }
            >
              <option value="">
                Todos
              </option>

              {doctors.map(
                (doctor: any) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div
            style={{
              marginTop: 30,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                marginBottom: 12,
              }}
            >
              Status
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div>🟦 Agendado</div>
              <div>🟩 Confirmado</div>
              <div>🟥 Cancelado</div>
              <div>🟪 Concluído</div>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              padding: 16,
              background: "#eff6ff",
              borderRadius: 18,
            }}
          >
            <strong>
              Total consultas
            </strong>

            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                marginTop: 8,
                color: "#2563eb",
              }}
            >
              {events.length}
            </div>
          </div>
        </aside>

        {/* CALENDÁRIO */}
        <section
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 20,
              boxShadow:
                "0 10px 30px rgba(15,23,42,0.06)",
              height: "100%",
            }}
          >
            <FullCalendar
              plugins={[
                timeGridPlugin,
                dayGridPlugin,
                interactionPlugin,
              ]}
              locale={ptBrLocale}
              initialView="timeGridWeek"
              selectable
              editable
              events={events}
              select={handleSelect}
              eventClick={
                handleEventClick
              }
              eventDrop={handleDrop}
              height="100%"
              allDaySlot={false}
              nowIndicator
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              expandRows
              headerToolbar={{
                left:
                  "prev,next today",
                center: "title",
                right:
                  "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
              }}
            />
          </div>
        </section>
      </main>

      {/* MODAL AGENDAMENTO */}
      <AppointmentModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSave={handleCreate}
        patients={patients}
        doctors={doctors}
        dateLabel={
          selectedDate
            ? new Date(
                selectedDate
              ).toLocaleString(
                "pt-BR"
              )
            : ""
        }
      />

      {/* MODAL EVOLUÇÃO */}
      {selectedPatient && (
        <MedicalEvolutionModal
          patient={selectedPatient}
          onClose={() =>
            setSelectedPatient(
              null
            )
          }
        />
      )}
    </>
  );
}