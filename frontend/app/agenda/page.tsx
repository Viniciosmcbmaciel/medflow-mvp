"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import AppointmentModal from "../../components/AppointmentModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("medflow_token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  async function loadAll() {
    const [apptRes, pRes, dRes] = await Promise.all([
      fetch(`${API_URL}/appointments`, { headers: getAuthHeaders() }),
      fetch(`${API_URL}/patients`, { headers: getAuthHeaders() }),
      fetch(`${API_URL}/users/medicos`, {
        headers: getAuthHeaders(),
      }),
    ]);

    const appts = await apptRes.json();

    const filtered = selectedDoctor
      ? appts.filter((a: any) => a.professionalId === selectedDoctor)
      : appts;

    setEvents(
      filtered.map((a: any) => ({
        id: a.id,
        title: a.patient.fullName,
        start: a.date,
        end: a.date,
        backgroundColor: statusColor[a.status],
        borderColor: statusColor[a.status],
      }))
    );

    setPatients(await pRes.json());
    setDoctors(await dRes.json());
  }

  useEffect(() => {
    if (ready) loadAll();
  }, [ready, selectedDoctor]);

  function handleSelect(info: any) {
    setSelectedDate(info.startStr);
    setModalOpen(true);
  }

  async function handleCreate({ patientId, doctorId }: any) {
    await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId,
        professionalId: doctorId,
        date: selectedDate,
        status: "SCHEDULED",
        appointmentType: "PARTICULAR",
      }),
    });

    setModalOpen(false);
    loadAll();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`${API_URL}/appointments/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    loadAll();
  }

  async function deleteAppointment(id: string) {
    if (!confirm("Excluir consulta?")) return;

    await fetch(`${API_URL}/appointments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    loadAll();
  }

  function handleEventClick(info: any) {
    const action = prompt(
      "1 Confirmar\n2 Concluir\n3 Cancelar\n4 Excluir"
    );

    if (!action) return;

    if (action === "4") {
      deleteAppointment(info.event.id);
    } else {
      const map: any = {
        "1": "CONFIRMED",
        "2": "COMPLETED",
        "3": "CANCELED",
      };
      updateStatus(info.event.id, map[action]);
    }
  }

  async function handleDrop(info: any) {
    await fetch(`${API_URL}/appointments/${info.event.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        date: info.event.start,
      }),
    });

    loadAll();
  }

  if (!ready) return <div>Carregando...</div>;

  return (
    <>
      <AppHeader />

      <main style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* 🔵 SIDEBAR */}
        <aside
          style={{
            width: 260,
            borderRight: "1px solid #e5e7eb",
            padding: 16,
            background: "#f9fafb",
          }}
        >
          <h3>Médicos</h3>

          <select
            style={{ width: "100%", marginTop: 10 }}
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Todos</option>
            {doctors.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 20 }}>
            <strong>Status</strong>
            <div style={{ marginTop: 10 }}>
              <div>🟦 Agendado</div>
              <div>🟩 Confirmado</div>
              <div>🟥 Cancelado</div>
              <div>🟪 Concluído</div>
            </div>
          </div>
        </aside>

        {/* 🟢 CALENDÁRIO */}
        <section style={{ flex: 1, padding: 16 }}>
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            selectable
            editable
            events={events}
            select={handleSelect}
            eventClick={handleEventClick}
            eventDrop={handleDrop}
            height="100%"
            locale="pt-br"
          />
        </section>
      </main>

      {/* 💎 MODAL */}
      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
        patients={patients}
        doctors={doctors}
        dateLabel={new Date(selectedDate).toLocaleString("pt-BR")}
      />
    </>
  );
}