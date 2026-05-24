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

type Patient = {
  id: string;

  fullName: string;

  birthDate?: string;

  cpf?: string;

  insurance?: string;

  phone?: string;

  email?: string;
};

export default function AgendaPage() {
  /* =========================================
     AGENDAMENTOS
  ========================================= */

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

  /* =========================================
     PACIENTES
  ========================================= */

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [
    filteredPatients,
    setFilteredPatients,
  ] = useState<Patient[]>([]);

  /* =========================================
     MODAIS
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
     FORM
  ========================================= */

  const [selectedDate, setSelectedDate] =
    useState("");

  const [patientName, setPatientName] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [insurance, setInsurance] =
    useState("");

  const [source, setSource] =
    useState("");

  const [
    appointmentType,
    setAppointmentType,
  ] = useState("Consulta");

  /* =========================================
     BUSCAR PACIENTES
  ========================================= */

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/patients"
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     AUTOCOMPLETE
  ========================================= */

  function handlePatientSearch(
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
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )
      );

    setFilteredPatients(filtered);
  }

  function selectPatient(
    patient: Patient
  ) {
    setPatientName(
      patient.fullName
    );

    setBirthDate(
      patient.birthDate || ""
    );

    setCpf(patient.cpf || "");

    setInsurance(
      patient.insurance || ""
    );

    setPhone(
      patient.phone || ""
    );

    setFilteredPatients([]);
  }

  /* =========================================
     CALENDARIO
  ========================================= */

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

    setPhone("");

    setInsurance("");

    setSource("");
  }

  /* =========================================
     NOVO PACIENTE
  ========================================= */

  async function createPatient() {
    try {
      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/patients",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName:
              patientName,

            birthDate,

            cpf,

            phone,

            email: "",

            insurance,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao salvar paciente"
        );
      }

      const patient =
        await response.json();

      setPatients([
        patient,
        ...patients,
      ]);

      alert(
        "Paciente cadastrado com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao cadastrar paciente"
      );
    }
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
              {/* PACIENTE */}
              <div
                style={{
                  gridColumn:
                    "1 / span 2",

                  position:
                    "relative",
                }}
              >
                <label className="form-label">
                  Nome do paciente
                </label>

                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <input
                    className="modal-input"
                    placeholder="Pesquisar paciente"
                    value={
                      patientName
                    }
                    onChange={(e) =>
                      handlePatientSearch(
                        e.target
                          .value
                      )
                    }
                  />

                  {filteredPatients.length >
                    0 && (
                    <div
                      style={{
                        position:
                          "absolute",

                        top: 60,

                        left: 0,

                        right: 0,

                        background:
                          "white",

                        border:
                          "1px solid #e2e8f0",

                        borderRadius: 14,

                        zIndex: 999,

                        overflow:
                          "hidden",

                        boxShadow:
                          "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    >
                      {filteredPatients.map(
                        (
                          patient
                        ) => (
                          <div
                            key={
                              patient.id
                            }
                            onClick={() =>
                              selectPatient(
                                patient
                              )
                            }
                            style={{
                              padding: 14,

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

                            <p
                              style={{
                                color:
                                  "#64748b",

                                fontSize: 13,

                                marginTop: 4,
                              }}
                            >
                              CPF:{" "}
                              {
                                patient.cpf
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

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
                  Data nascimento
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
                  Telefone
                </label>

                <input
                  className="modal-input"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
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
                  "space-between",

                marginTop: 30,
              }}
            >
              <button
                className="secondary-button"
                onClick={
                  createPatient
                }
              >
                + Novo Paciente
              </button>

              <div
                style={{
                  display: "flex",
                  gap: 12,
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
        </div>
      )}

      {/* STATUS */}
{selectedAppointment && (
  <div className="premium-modal-overlay">
    <div
      className="premium-modal"
      style={{
        maxWidth: 560,
        padding: 32,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Gerenciar Consulta
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: 16,
          }}
        >
          {
            selectedAppointment.title
          }
        </p>
      </div>

      {/* INFO */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: 18,
          padding: 18,
          marginBottom: 24,
          border:
            "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <strong>
              Status:
            </strong>{" "}
            {
              selectedAppointment.status
            }
          </div>

          <div>
            <strong>
              Início:
            </strong>{" "}
            {new Date(
              selectedAppointment.start
            ).toLocaleString(
              "pt-BR"
            )}
          </div>

          <div>
            <strong>
              Fim:
            </strong>{" "}
            {new Date(
              selectedAppointment.end
            ).toLocaleString(
              "pt-BR"
            )}
          </div>
        </div>
      </div>

      {/* AÇÕES PRINCIPAIS */}
      <div
        style={{
          display: "grid",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* TELECONSULTA */}
        <button
          className="primary-button"
          style={{
            width: "100%",
            padding: 16,
            fontSize: 16,
          }}
          onClick={() =>
            window.open(
              `/teleconsulta/${selectedAppointment.id}`,
              "_blank"
            )
          }
        >
          📹 Iniciar Teleconsulta
        </button>

        {/* PRONTUARIO */}
        <button
          className="secondary-button"
          style={{
            width: "100%",
            padding: 16,
            fontSize: 16,
          }}
          onClick={() =>
            window.open(
              `/prontuarios?appointmentId=${selectedAppointment.id}`,
              "_blank"
            )
          }
        >
          📋 Abrir Prontuário
        </button>

        {/* PRESCRIÇÃO */}
        <button
          className="secondary-button"
          style={{
            width: "100%",
            padding: 16,
            fontSize: 16,
          }}
          onClick={() =>
            window.open(
              `/prescricoes?appointmentId=${selectedAppointment.id}`,
              "_blank"
            )
          }
        >
          💊 Abrir Prescrição
        </button>
      </div>

      {/* STATUS */}
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
          ✅ Confirmar Consulta
        </button>

        <button
          className="secondary-button"
          onClick={() =>
            updateStatus(
              "concluido"
            )
          }
        >
          ✔️ Finalizar Consulta
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
          ❌ Cancelar Consulta
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
          🗑 Excluir Consulta
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