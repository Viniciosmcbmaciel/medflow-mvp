"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import {
  useEffect,
  useState,
} from "react";

type Appointment = {
  id: number;
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
  /* =========================================
     EVENTOS
  ========================================= */

  const [events, setEvents] =
    useState<Appointment[]>([
      {
        id: 1,

        title:
          "Consulta • João Silva",

        start:
          "2026-05-18T09:00:00",

        end:
          "2026-05-18T10:00:00",

        status: "confirmado",
      },
    ]);

  /* =========================================
     PACIENTES
  ========================================= */

  const [patients, setPatients] =
    useState<any[]>([]);

  const [
    filteredPatients,
    setFilteredPatients,
  ] = useState<any[]>([]);

  /* =========================================
     MODAL
  ========================================= */

  const [openModal, setOpenModal] =
    useState(false);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<Appointment | null>(
    null
  );

  /* =========================================
     FORMULARIO
  ========================================= */

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

  /* =========================================
     CARREGAR PACIENTES
  ========================================= */

  useEffect(() => {
    async function loadPatients() {
      try {
        const token =
          localStorage.getItem(
            "medflow_token"
          );

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/patients`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        setPatients(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadPatients();
  }, []);

  /* =========================================
     PESQUISA
  ========================================= */

  function searchPatients(
    value: string
  ) {
    setPatientName(value);

    if (!value) {
      setFilteredPatients([]);
      return;
    }

    const filtered =
      patients.filter((patient) =>
        patient.fullName
          ?.toLowerCase()
          .includes(
            value.toLowerCase()
          )
      );

    setFilteredPatients(filtered);
  }

  /* =========================================
     SELECIONAR PACIENTE
  ========================================= */

  function selectPatient(
    patient: any
  ) {
    setPatientName(
      patient.fullName || ""
    );

    setBirthDate(
      patient.birthDate?.slice(
        0,
        10
      ) || ""
    );

    setCpf(patient.cpf || "");

    setInsurance(
      patient.insurance || ""
    );

    setFilteredPatients([]);
  }

  /* =========================================
     ABRIR MODAL
  ========================================= */

  function handleDateClick(
    info: any
  ) {
    setSelectedDate(info.dateStr);

    setOpenModal(true);
  }

  /* =========================================
     CRIAR AGENDAMENTO
  ========================================= */

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
        id: Date.now(),

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

  /* =========================================
     STATUS
  ========================================= */

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
              Clique em qualquer horário
              para criar um agendamento.
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
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Novo Agendamento
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 18,
              }}
            >
              {/* PACIENTE */}
              <div
                style={{
                  gridColumn:
                    "1 / span 2",

                  position: "relative",
                }}
              >
                <label className="form-label">
                  Nome do paciente
                </label>

                <input
                  className="modal-input"
                  placeholder="Pesquisar paciente"
                  value={patientName}
                  onChange={(e) =>
                    searchPatients(
                      e.target.value
                    )
                  }
                />

                {filteredPatients.length >
                  0 && (
                  <div
                    style={{
                      position:
                        "absolute",

                      top: "100%",

                      left: 0,

                      right: 0,

                      background:
                        "white",

                      border:
                        "1px solid #d1d5db",

                      borderRadius: 14,

                      marginTop: 6,

                      zIndex: 999,

                      maxHeight: 240,

                      overflowY:
                        "auto",

                      boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                  >
                    {filteredPatients.map(
                      (patient) => (
                        <button
                          key={
                            patient.id
                          }
                          type="button"
                          onClick={() =>
                            selectPatient(
                              patient
                            )
                          }
                          style={{
                            width: "100%",

                            textAlign:
                              "left",

                            padding: 14,

                            border:
                              "none",

                            background:
                              "white",

                            cursor:
                              "pointer",

                            borderBottom:
                              "1px solid #f1f5f9",
                          }}
                        >
                          <strong>
                            {
                              patient.fullName
                            }
                          </strong>

                          <div
                            style={{
                              fontSize: 13,

                              color:
                                "#64748b",

                              marginTop: 4,
                            }}
                          >
                            CPF:{" "}
                            {
                              patient.cpf
                            }
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* DATA */}
              <div>
                <label className="form-label">
                  Data e horário
                </label>

                <input
                  type="datetime-local"
                  className="modal-input"
                  value={selectedDate.slice(
                    0,
                    16
                  )}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* TIPO */}
              <div>
                <label className="form-label">
                  Tipo
                </label>

                <select
                  className="modal-input"
                  value={
                    appointmentType
                  }
                  onChange={(e) =>
                    setAppointmentType(
                      e.target.value
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

              {/* NASCIMENTO */}
              <div>
                <label className="form-label">
                  Nascimento
                </label>

                <input
                  type="date"
                  className="modal-input"
                  value={birthDate}
                  onChange={(e) =>
                    setBirthDate(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* CPF */}
              <div>
                <label className="form-label">
                  CPF
                </label>

                <input
                  className="modal-input"
                  value={cpf}
                  onChange={(e) =>
                    setCpf(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* CONVENIO */}
              <div>
                <label className="form-label">
                  Convênio
                </label>

                <input
                  className="modal-input"
                  value={insurance}
                  onChange={(e) =>
                    setInsurance(
                      e.target.value
                    )
                  }
                />
              </div>

              {/* COMO CONHECEU */}
              <div>
                <label className="form-label">
                  Como conheceu
                </label>

                <select
                  className="modal-input"
                  value={source}
                  onChange={(e) =>
                    setSource(
                      e.target.value
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
                  setOpenModal(false)
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
                onClick={() =>
                  updateStatus(
                    "cancelado"
                  )
                }
              >
                ❌ Cancelar
              </button>

              <button
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