"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRequireAuth } from "../../lib/auth";

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

export default function AgendaPage() {
  const { ready } = useRequireAuth();

  const [events, setEvents] = useState([]);

  async function loadAppointments() {
    const res = await fetch(`${API_URL}/appointments`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();

    const formatted = data.map((a: any) => ({
      id: a.id,
      title: a.patient.fullName,
      start: a.date,
      end: a.date,
    }));

    setEvents(formatted);
  }

  useEffect(() => {
    if (ready) loadAppointments();
  }, [ready]);

  async function handleCreate(info: any) {
    const patientId = prompt("ID do paciente:");
    const doctorId = prompt("ID do médico:");

    if (!patientId || !doctorId) return;

    await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId,
        professionalId: doctorId,
        date: info.dateStr,
        status: "SCHEDULED",
        appointmentType: "PARTICULAR",
      }),
    });

    loadAppointments();
  }

  async function handleEventClick(info: any) {
    const action = prompt(
      "Digite:\n1 - Confirmar\n2 - Concluir\n3 - Cancelar\n4 - Excluir"
    );

    if (!action) return;

    if (action === "4") {
      await fetch(`${API_URL}/appointments/${info.event.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } else {
      const map: any = {
        "1": "CONFIRMED",
        "2": "COMPLETED",
        "3": "CANCELED",
      };

      await fetch(`${API_URL}/appointments/${info.event.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: map[action],
        }),
      });
    }

    loadAppointments();
  }

  if (!ready) return <div>Carregando...</div>;

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Agenda</h1>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="pt-br"
          selectable={true}
          events={events}
          select={handleCreate}
          eventClick={handleEventClick}
          height="auto"
        />
      </main>
    </>
  );
}