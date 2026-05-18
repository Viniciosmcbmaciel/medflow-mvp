"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import { useState } from "react";

type Appointment = {
  title: string;
  start: string;
  end: string;
};

export default function AgendaPage() {
  const [events, setEvents] =
    useState<Appointment[]>([
      {
        title:
          "Consulta • João Silva",
        start:
          "2026-05-18T09:00:00",
        end:
          "2026-05-18T10:00:00",
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

  const [appointmentType, setAppointmentType] =
    useState("Consulta");

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
        title: `${appointmentType} • ${patientName}`,

        start: startDate,

        end:
          endDate.toISOString(),
      },
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
            events={events}
            nowIndicator={true}
            weekends={true}
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

      {/* MODAL */}
      {openModal && (
        <div className="premium-modal-overlay">
          <div
            className="premium-modal"
            style={{
              maxWidth: 850,
              padding: 36,
            }}
          >
            {/* HEADER */}
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

            {/* FORM */}
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
                    selectedDate.slice(
                      0,
                      16
                    )
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

            {/* FOOTER */}
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
    </div>
  );
}