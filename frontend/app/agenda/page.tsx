"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { useState } from "react";

type Appointment = {
  id: string;

  title: string;

  start: string;

  end: string;

  status:
    | "confirmado"
    | "pendente"
    | "cancelado"
    | "concluido";
};

export default function AgendaPage() {
  const [events, setEvents] =
    useState<Appointment[]>([
      {
        id: "1",

        title:
          "Consulta • João Silva",

        start:
          "2026-05-18T09:00:00",

        end:
          "2026-05-18T10:00:00",

        status: "confirmado",
      },
    ]);

  const [openModal, setOpenModal] =
    useState(false);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<Appointment | null>(
    null
  );

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

  const [
    appointmentType,
    setAppointmentType,
  ] = useState("Consulta");

  function handleDateClick(
    info: any
  ) {
    setSelectedDate(info.dateStr);

    setOpenModal(true);
  }

  function createAppointment() {
    if (!patientName) {
      alert(
        "Informe o nome do paciente"
      );

      return;
    }

    const startDate =
      selectedDate;

    const endDate = new Date(
      startDate
    );

    endDate.setMinutes(
      endDate.getMinutes() + 60
    );

    setEvents([
      ...events,

      {
        id: Date.now().toString(),

        title: `${appointmentType} • ${patientName}`,

        start: startDate,

        end:
          endDate.toISOString(),

        status: "pendente",
      },
    ]);

    setOpenModal(false);

    setPatientName("");
    setBirthDate("");
    setCpf("");
    setInsurance("");
    setSource("");
  }

  function updateStatus(
    status:
      | "confirmado"
      | "cancelado"
      | "concluido"
  ) {
    if (!selectedAppointment)
      return;

    setEvents((prev) =>
      prev.map((event) =>
        event.id ===
        selectedAppointment.id
          ? {
              ...event,
              status,
            }
          : event
      )
    );

    setSelectedAppointment(null);
  }

  function deleteAppointment() {
    if (!selectedAppointment)
      return;

    setEvents((prev) =>
      prev.filter(
        (event) =>
          event.id !==
          selectedAppointment.id
      )
    );

    setSelectedAppointment(null);
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

      {/* MAIN */}
      <main className="main-content">
        <div className="card">
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <h1
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              Agenda Médica
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: 8,
              }}
            >
              Clique em qualquer
              horário da agenda para
              criar um novo
              agendamento.
            </p>
          </div>

          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"
            selectable={true}
            locale={ptBrLocale}
            dateClick={
              handleDateClick
            }
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            height="80vh"
            nowIndicator={true}
            weekends={true}
            eventClick={(info) => {
              const appointment =
                info.event
                  .extendedProps
                  .appointment;

              setSelectedAppointment(
                appointment
              );
            }}
            events={events.map(
              (event) => ({
                ...event,

                backgroundColor:
                  event.status ===
                  "confirmado"
                    ? "#22c55e"
                    : event.status ===
                      "cancelado"
                    ? "#ef4444"
                    : event.status ===
                      "concluido"
                    ? "#2563eb"
                    : "#f59e0b",

                borderColor:
                  "transparent",

                appointment: event,
              })
            )}
            headerToolbar={{
              left:
                "prev,next today",

              center: "title",

              right:
                "dayGridMonth,timeGridWeek,timeGridDay",
            }}
          />
        </div>
      </main>

      {/* MODAL NOVO */}
      {openModal && (
        <div className="premium-modal-overlay">
          <div
            className="premium-modal"
            style={{
              maxWidth: 850,
              padding: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom: 28,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                  }}
                >
                  Novo Agendamento
                </h2>

                <p
                  style={{
                    color:
                      "#64748b",
                    marginTop: 8,
                  }}
                >
                  Configure o
                  atendimento do
                  paciente.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
              >
                Fechar
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 18,
              }}
            >
              <div
                style={{
                  gridColumn:
                    "1 / span 2",
                }}
              >
                <label className="form-label">
                  Nome do paciente
                </label>

                <input
                  className="modal-input"
                  placeholder="Pesquisar ou digitar nome"
                  value={
                    patientName
                  }
                  onChange={(e) =>
                    setPatientName(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  Data e horário
                </label>

                <input
                  type="datetime-local"
                  className="modal-input"
                  value={
                    selectedDate
                      ? selectedDate.slice(
                          0,
                          16
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedDate(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  Tipo de consulta
                </label>

                <select
                  className="modal-input"
                  value={
                    appointmentType
                  }
                  onChange={(e) =>
                    setAppointmentType(
                      e.target
                        .value
                    )
                  }
                >
                  <option>
                    Consulta
                  </option>

                  <option>
                    Retorno
                  </option>

                  <option>
                    Avaliação
                  </option>

                  <option>
                    Teleconsulta
                  </option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Data de nascimento
                </label>

                <input
                  type="date"
                  className="modal-input"
                  value={
                    birthDate
                  }
                  onChange={(e) =>
                    setBirthDate(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  CPF
                </label>

                <input
                  className="modal-input"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) =>
                    setCpf(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  Convênio
                </label>

                <input
                  className="modal-input"
                  placeholder="Particular ou convênio"
                  value={
                    insurance
                  }
                  onChange={(e) =>
                    setInsurance(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  Como conheceu
                </label>

                <select
                  className="modal-input"
                  value={source}
                  onChange={(e) =>
                    setSource(
                      e.target
                        .value
                    )
                  }
                >
                  <option value="">
                    Selecionar
                  </option>

                  <option>
                    Instagram
                  </option>

                  <option>
                    Google
                  </option>

                  <option>
                    Indicação
                  </option>

                  <option>
                    Convênio
                  </option>

                  <option>
                    Outro
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 12,
                marginTop: 30,
              }}
            >
              <button
                className="secondary-button"
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
              >
                Cancelar
              </button>

              <button
                className="primary-button"
                onClick={
                  createAppointment
                }
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STATUS */}
      {selectedAppointment && (
        <div className="premium-modal-overlay">
          <div
            className="premium-modal"
            style={{
              maxWidth: 520,
              padding: 30,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Gerenciar Consulta
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: 24,
              }}
            >
              {
                selectedAppointment.title
              }
            </p>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <button
                className="primary-button"
                onClick={() =>
                  updateStatus(
                    "confirmado"
                  )
                }
              >
                ✅ Confirmar
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  updateStatus(
                    "concluido"
                  )
                }
              >
                ✔️ Concluir
              </button>

              <button
                style={{
                  background:
                    "#ef4444",
                  color: "white",
                  border: "none",
                  padding:
                    "14px 20px",
                  borderRadius: 14,
                  fontWeight: 700,
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  updateStatus(
                    "cancelado"
                  )
                }
              >
                ❌ Cancelar
              </button>

              <button
                style={{
                  background:
                    "#0f172a",
                  color: "white",
                  border: "none",
                  padding:
                    "14px 20px",
                  borderRadius: 14,
                  fontWeight: 700,
                  cursor:
                    "pointer",
                }}
                onClick={
                  deleteAppointment
                }
              >
                🗑 Excluir
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}