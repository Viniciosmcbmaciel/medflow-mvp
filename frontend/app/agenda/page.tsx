"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

type Patient = {
  id: string;
  fullName: string;
};

type Doctor = {
  id: string;
  name: string;
  crm?: string | null;
  specialty?: string | null;
};

type AppointmentType = "PARTICULAR" | "CONVENIO";

type Appointment = {
  id: string;
  patientId: string;
  professionalId?: string | null;
  date: string;
  status: "SCHEDULED" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  appointmentType: AppointmentType;
  insuranceName?: string | null;
  notes?: string | null;
  patient: Patient;
};

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

function toApiDateTime(dateTimeLocal: string) {
  return new Date(dateTimeLocal).toISOString();
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatWeekday(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function getStatusLabel(status: Appointment["status"]) {
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

function getAppointmentTypeLabel(type: AppointmentType) {
  return type === "CONVENIO" ? "Convênio" : "Particular";
}

function getStatusStyles(status: Appointment["status"]) {
  switch (status) {
    case "SCHEDULED":
      return { background: "#eff6ff", border: "#93c5fd", title: "#1d4ed8" };
    case "CONFIRMED":
      return { background: "#ecfdf5", border: "#86efac", title: "#166534" };
    case "CANCELED":
      return { background: "#fef2f2", border: "#fca5a5", title: "#b91c1c" };
    case "COMPLETED":
      return { background: "#f5f3ff", border: "#c4b5fd", title: "#6d28d9" };
    default:
      return { background: "#f8fafc", border: "#cbd5e1", title: "#0f172a" };
  }
}

function getTimeSlots() {
  const slots: string[] = [];

  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);

    if (hour !== 18) {
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }

  return slots;
}

function getAppointmentTime(dateString: string) {
  const date = new Date(dateString);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function getAppointmentDayKey(dateString: string) {
  return formatDateInput(new Date(dateString));
}

function toDateTimeLocalString(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);

  result.setHours(hours, minutes, 0, 0);

  const year = result.getFullYear();
  const month = `${result.getMonth() + 1}`.padStart(2, "0");
  const day = `${result.getDate()}`.padStart(2, "0");
  const hh = `${result.getHours()}`.padStart(2, "0");
  const mm = `${result.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hh}:${mm}`;
}

function AgendaContent() {
  const { ready } = useRequireAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [appointmentType, setAppointmentType] =
    useState<AppointmentType>("PARTICULAR");
  const [insuranceName, setInsuranceName] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) =>
      addDays(weekStart, index)
    );
  }, [weekStart]);

  const timeSlots = useMemo(() => getTimeSlots(), []);

  async function loadAppointments(selectedDoctor?: string) {
    try {
      setLoading(true);

      const start = formatDateInput(weekDays[0]);
      const end = formatDateInput(addDays(weekDays[6], 1));

      const params = new URLSearchParams();
      params.append("date_from", start);
      params.append("date_to", end);

      if (selectedDoctor) {
        params.append("professionalId", selectedDoctor);
      }

      const res = await fetch(`${API_URL}/appointments?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao buscar consultas");
      }

      setAppointments(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar agenda");
    } finally {
      setLoading(false);
    }
  }

  async function loadPatients() {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao buscar pacientes");
      }

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadDoctors() {
    try {
      const res = await fetch(`${API_URL}/users/medicos`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao buscar médicos");
      }

      setDoctors(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCellClick(day: Date, time: string) {
    setDate(toDateTimeLocalString(day, time));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitAppointment(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId,
          professionalId,
          date: toApiDateTime(date),
          notes,
          status: "SCHEDULED",
          appointmentType,
          insuranceName: appointmentType === "CONVENIO" ? insuranceName : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao salvar consulta");
      }

      setPatientId("");
      setProfessionalId("");
      setDate("");
      setNotes("");
      setAppointmentType("PARTICULAR");
      setInsuranceName("");

      await loadAppointments(filterDoctor);

      alert("Consulta criada com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar consulta");
    }
  }

  async function updateStatus(id: string, newStatus: Appointment["status"]) {
    try {
      const appointment = appointments.find((item) => item.id === id);

      if (!appointment) return;

      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientId: appointment.patientId,
          professionalId: appointment.professionalId,
          date: appointment.date,
          notes: appointment.notes,
          status: newStatus,
          appointmentType: appointment.appointmentType,
          insuranceName: appointment.insuranceName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao atualizar consulta");
      }

      await loadAppointments(filterDoctor);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao atualizar consulta");
    }
  }

  async function deleteAppointment(id: string) {
    const confirmed = confirm("Deseja excluir esta consulta?");

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao excluir consulta");
      }

      await loadAppointments(filterDoctor);
      alert("Consulta excluída com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao excluir consulta");
    }
  }

  useEffect(() => {
    if (ready) {
      loadPatients();
      loadDoctors();
    }
  }, [ready]);

  useEffect(() => {
    if (ready) {
      loadAppointments(filterDoctor);
    }
  }, [ready, filterDoctor, weekStart]);

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <div
          className="form-card"
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(22,163,74,0.05))",
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 8 }}>
            Agenda
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Organize consultas em uma visualização semanal com experiência SaaS
            profissional.
          </p>
        </div>

        <form onSubmit={handleSubmitAppointment} className="form-card">
          <h2 className="section-title">Nova Consulta</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div className="field">
              <label className="label">Paciente</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="select"
                required
              >
                <option value="">Selecione</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Médico</label>
              <select
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                className="select"
                required
              >
                <option value="">Selecione</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                    {doctor.crm ? ` - CRM ${doctor.crm}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Data e hora</label>
              <input
                type="datetime-local"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">Tipo</label>
              <select
                value={appointmentType}
                onChange={(e) =>
                  setAppointmentType(e.target.value as AppointmentType)
                }
                className="select"
              >
                <option value="PARTICULAR">Particular</option>
                <option value="CONVENIO">Convênio</option>
              </select>
            </div>
          </div>

          {appointmentType === "CONVENIO" && (
            <div className="field">
              <label className="label">Nome do convênio</label>
              <input
                className="input"
                value={insuranceName}
                onChange={(e) => setInsuranceName(e.target.value)}
                placeholder="Ex.: Amil, Bradesco, SulAmérica"
              />
            </div>
          )}

          <div className="field">
            <label className="label">Observações</label>
            <textarea
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre a consulta"
            />
          </div>

          <button type="submit" className="button button-primary">
            Salvar consulta
          </button>
        </form>

        <section className="form-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
              alignItems: "center",
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Agenda Semanal
            </h2>

            <div className="actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                Semana anterior
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={() => setWeekStart(startOfWeek(new Date()))}
              >
                Semana atual
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                Próxima semana
              </button>
            </div>
          </div>

          <div className="field" style={{ maxWidth: 320 }}>
            <label className="label">Filtrar por médico</label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="select"
            >
              <option value="">Todos</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="empty-state">Carregando agenda...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  minWidth: 1100,
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: 14,
                        background: "#e2fbe8",
                        color: "#166534",
                        textAlign: "left",
                        borderTopLeftRadius: 16,
                        width: 90,
                      }}
                    >
                      Horário
                    </th>

                    {weekDays.map((day, index) => (
                      <th
                        key={day.toISOString()}
                        style={{
                          padding: 14,
                          background: "#eff6ff",
                          color: "#0f172a",
                          textAlign: "left",
                          borderTopRightRadius:
                            index === weekDays.length - 1 ? 16 : 0,
                        }}
                      >
                        {formatWeekday(day)}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      <td
                        style={{
                          padding: 12,
                          background: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
                          fontWeight: 800,
                          color: "#334155",
                          verticalAlign: "top",
                        }}
                      >
                        {time}
                      </td>

                      {weekDays.map((day) => {
                        const dayKey = formatDateInput(day);

                        const cellAppointments = appointments.filter(
                          (appointment) => {
                            return (
                              getAppointmentDayKey(appointment.date) ===
                                dayKey &&
                              getAppointmentTime(appointment.date) === time
                            );
                          }
                        );

                        return (
                          <td
                            key={`${dayKey}-${time}`}
                            onClick={() => handleCellClick(day, time)}
                            style={{
                              padding: 10,
                              verticalAlign: "top",
                              borderBottom: "1px solid #e2e8f0",
                              background: "#fff",
                              cursor: "pointer",
                              minHeight: 80,
                            }}
                          >
                            {cellAppointments.length === 0 ? (
                              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                                Livre
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 8,
                                }}
                              >
                                {cellAppointments.map((appointment) => {
                                  const statusStyle = getStatusStyles(
                                    appointment.status
                                  );

                                  return (
                                    <div
                                      key={appointment.id}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        border: `1px solid ${statusStyle.border}`,
                                        background: statusStyle.background,
                                        borderRadius: 14,
                                        padding: 10,
                                        fontSize: 12,
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: 800,
                                          color: statusStyle.title,
                                          marginBottom: 6,
                                        }}
                                      >
                                        {appointment.patient.fullName}
                                      </div>

                                      <div
  className={`status-badge status-${appointment.status.toLowerCase()}`}
>
  {getStatusLabel(appointment.status)}
</div>

                                      <div>
                                        <strong>Tipo:</strong>{" "}
                                        {getAppointmentTypeLabel(
                                          appointment.appointmentType
                                        )}
                                      </div>

                                      {appointment.appointmentType ===
                                        "CONVENIO" && (
                                        <div>
                                          <strong>Convênio:</strong>{" "}
                                          {appointment.insuranceName || "—"}
                                        </div>
                                      )}

                                      {appointment.notes && (
                                        <div>
                                          <strong>Obs:</strong>{" "}
                                          {appointment.notes}
                                        </div>
                                      )}

                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 6,
                                          marginTop: 10,
                                        }}
                                      >
                                        <button
                                          type="button"
                                          className="button button-green"
                                          onClick={() =>
                                            updateStatus(
                                              appointment.id,
                                              "CONFIRMED"
                                            )
                                          }
                                        >
                                          Confirmar
                                        </button>

                                        <button
                                          type="button"
                                          className="button button-blue"
                                          onClick={() =>
                                            updateStatus(
                                              appointment.id,
                                              "COMPLETED"
                                            )
                                          }
                                        >
                                          Concluir
                                        </button>

                                        <button
                                          type="button"
                                          className="button button-yellow"
                                          onClick={() =>
                                            updateStatus(
                                              appointment.id,
                                              "CANCELED"
                                            )
                                          }
                                        >
                                          Cancelar
                                        </button>

                                        <button
                                          type="button"
                                          className="button button-red"
                                          onClick={() =>
                                            deleteAppointment(appointment.id)
                                          }
                                        >
                                          Excluir
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <AgendaContent />
    </Suspense>
  );
}