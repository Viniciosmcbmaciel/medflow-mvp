"use client";

import { useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Appointment = {
  title: string;
  start: string;
};

export default function AgendaPage() {
  const [events, setEvents] =
    useState<Appointment[]>([
      {
        title: "Consulta",
        start:
          "2026-05-14T09:00:00",
      },
    ]);

  function handleDateClick(
    info: any
  ) {
    const patientName =
      prompt(
        "Nome do paciente:"
      );

    if (!patientName) return;

    const newEvent = {
      title: patientName,
      start: info.dateStr,
    };

    setEvents([
      ...events,
      newEvent,
    ]);
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="sidebar-title">
          MedFlow
        </h1>

        <nav className="sidebar-menu">
          <a href="/agenda">
            Agenda
          </a>

          <a href="/pacientes">
            Pacientes
          </a>

          <a href="/prontuarios">
            Prontuários
          </a>

          <a href="/prescricoes">
            Prescrições
          </a>

          <a href="/historico">
            Histórico
          </a>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="main-content">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                Agenda Médica
              </h1>

              <p
                style={{
                  color: "#64748b",
                  marginTop: 6,
                }}
              >
                Clique em um horário
                para realizar um novo
                agendamento.
              </p>
            </div>

            <button className="primary-button">
              + Nova Consulta
            </button>
          </div>

          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            selectable={true}
            dateClick={
              handleDateClick
            }
            locale="pt-br"
            height="80vh"
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            expandRows={true}
            weekends={true}
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
            events={events}
            eventColor="#16a34a"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>
      </main>
    </div>
  );
}