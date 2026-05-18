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
        title: "João Silva",
        start:
          "2026-05-14T09:00:00",
      },
    ]);

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [patientName, setPatientName] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [insurance, setInsurance] =
    useState("");

  const [source, setSource] =
    useState("");

  function handleDateClick(
    info: any
  ) {
    setSelectedDate(
      info.dateStr.slice(0, 16)
    );

    setOpenModal(true);
  }

  function createAppointment() {
    if (!patientName) {
      alert(
        "Informe o nome do paciente"
      );

      return;
    }

    const newEvent = {
      title: patientName,
      start: selectedDate,
    };

    setEvents([
      ...events,
      newEvent,
    ]);

    setOpenModal(false);

    setPatientName("");
    setBirthDate("");
    setCpf("");
    setInsurance("");
    setSource("");
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
                para criar um
                agendamento.
              </p>
            </div>
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
          />
        </div>
      </main>

      {/* MODAL */}
      {openModal && (
        <div className="premium-modal-overlay">
          <div
            className="premium-modal"
            style={{
              maxWidth: 600,
              padding: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                Novo Agendamento
              </h2>

              <button
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
                className="primary-button"
              >
                Fechar
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <input
                placeholder="Nome do paciente"
                value={patientName}
                onChange={(e) =>
                  setPatientName(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <input
                type="date"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <input
                placeholder="CPF"
                value={cpf}
                onChange={(e) =>
                  setCpf(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <input
                placeholder="Convênio ou Particular"
                value={insurance}
                onChange={(e) =>
                  setInsurance(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <input
                placeholder="Como conheceu?"
                value={source}
                onChange={(e) =>
                  setSource(
                    e.target.value
                  )
                }
                className="modal-input"
              />

              <button
                onClick={
                  createAppointment
                }
                className="primary-button"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}