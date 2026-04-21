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

type AgendaConfig = {
  startHour: string;
  endHour: string;
  intervalMinutes: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_KEY = "medflow_agenda_config";

const defaultConfig: AgendaConfig = {
  startHour: "08:00",
  endHour: "18:00",
  intervalMinutes: 30,
};

function getAuthHeaders() {
  const token = localStorage.getItem("medflow_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
  switch (type) {
    case "PARTICULAR":
      return "Particular";
    case "CONVENIO":
      return "Convênio";
    default:
      return type;
  }
}

function getStatusStyles(status: Appointment["status"]) {
  switch (status) {
    case "SCHEDULED":
      return {
        background: "#eff6ff",
        border: "#93c5fd",
        title: "#1d4ed8",
      };
    case "CONFIRMED":
      return {
        background: "#ecfdf5",
        border: "#86efac",
        title: "#166534",
      };
    case "CANCELED":
      return {
        background: "#fef2f2",
        border: "#fca5a5",
        title: "#b91c1c",
      };
    case "COMPLETED":
      return {
        background: "#f5f3ff",
        border: "#c4b5fd",
        title: "#6d28d9",
      };
    default:
      return {
        background: "#f9fafb",
        border: "#d1d5db",
        title: "#111827",
      };
  }
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

function getTimeSlots(
  startHour: string,
  endHour: string,
  intervalMinutes: number
) {
  const [startH, startM] = startHour.split(":").map(Number);
  const [endH, endM] = endHour.split(":").map(Number);

  const slots: string[] = [];
  const current = new Date();
  current.setHours(startH, startM, 0, 0);

  const end = new Date();
  end.setHours(endH, endM, 0, 0);

  while (current <= end) {
    const hh = `${current.getHours()}`.padStart(2, "0");
    const mm = `${current.getMinutes()}`.padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}

function getAppointmentTime(dateString: string) {
  const date = new Date(dateString);
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");
  return `${hh}:${mm}`;
}

function getAppointmentDayKey(dateString: string) {
  return formatDateInput(new Date(dateString));
}

function getStoredAgendaConfig(): AgendaConfig {
  if (typeof window === "undefined") return defaultConfig;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultConfig;

  try {
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

function isToday(date: Date) {
  const today = new Date();
  return formatDateInput(today) === formatDateInput(date);
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

function toDateTimeLocalFromIso(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hh}:${mm}`;
}

function AgendaPageContent() {
  const { ready } = useRequireAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Appointment["status"]>("SCHEDULED");
  const [appointmentType, setAppointmentType] =
    useState<AppointmentType>("PARTICULAR");
  const [insuranceName, setInsuranceName] = useState("");

  const [loading, setLoading] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [agendaConfig, setAgendaConfig] = useState<AgendaConfig>(defaultConfig);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index));
  }, [weekStart]);

  const timeSlots = useMemo(() => {
    return getTimeSlots(
      agendaConfig.startHour,
      agendaConfig.endHour,
      agendaConfig.intervalMinutes
    );
  }, [agendaConfig]);

  async function loadAppointments(selectedDoctor?: string) {
    try {
      setLoading(true);

      const start = formatDateInput(weekDays[0]);
      const end = formatDateInput(weekDays[6]);
      const params = new URLSearchParams();
      params.append("date_from", start);
      params.append("date_to", end);

      if (selectedDoctor) {
        params.append("professionalId", selectedDoctor);
      }

      const res = await fetch(`${API_URL}/appointments?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar consultas");
      }

      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar consultas");
    } finally {
      setLoading(false);
    }
  }

  async function loadPatients() {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao buscar pacientes");

      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar pacientes");
    }
  }

  async function loadDoctors() {
    try {
      const res = await fetch(`${API_URL}/users/medicos`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Erro ao buscar médicos");

      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar médicos");
    }
  }

  function resetForm() {
    setEditingId(null);
    setPatientId("");
    setProfessionalId("");
    setDate("");
    setNotes("");
    setStatus("SCHEDULED");
    setAppointmentType("PARTICULAR");
    setInsuranceName("");
  }

  function handleEditAppointment(appointment: Appointment) {
    setEditingId(appointment.id);
    setPatientId(appointment.patientId);
    setProfessionalId(appointment.professionalId || "");
    setDate(toDateTimeLocalFromIso(appointment.date));
    setNotes(appointment.notes || "");
    setStatus(appointment.status);
    setAppointmentType(appointment.appointmentType);
    setInsuranceName(appointment.insuranceName || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitAppointment(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        patientId,
        professionalId,
        date,
        notes,
        status,
        appointmentType,
        insuranceName,
      };

      const url = editingId
        ? `${API_URL}/appointments/${editingId}`
        : `${API_URL}/appointments`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Erro ao salvar consulta");
      }

      resetForm();
      await loadAppointments(filterDoctor);
      alert(
        editingId
          ? "Consulta atualizada com sucesso"
          : "Consulta criada com sucesso"
      );
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
        throw new Error(data.error || "Erro ao atualizar status");
      }

      await loadAppointments(filterDoctor);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao atualizar status");
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
        throw new Error(data.error || "Erro ao excluir consulta");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadAppointments(filterDoctor);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao excluir consulta");
    }
  }

  function handleCellClick(day: Date, time: string) {
    setDate(toDateTimeLocalString(day, time));
    if (!editingId) {
      setStatus("SCHEDULED");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (ready) {
      setAgendaConfig(getStoredAgendaConfig());
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
        <h1 className="page-title">Agenda Semanal</h1>
        <p className="page-subtitle">
          Visualização semanal de consultas com horários configuráveis.
        </p>

        <form onSubmit={handleSubmitAppointment} className="form-card">
          <h2 className="section-title">
            {editingId ? "Editar Consulta" : "Nova Consulta"}
          </h2>

          <div className="field">
            <label className="label">Paciente</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="select"
              required
            >
              <option value="">Selecione o paciente</option>
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
              <option value="">Selecione o médico</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.crm ? `- CRM ${doctor.crm}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Data e hora</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="field">
            <label className="label">Tipo de consulta</label>
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

          {appointmentType === "CONVENIO" && (
            <div className="field">
              <label className="label">Nome do convênio</label>
              <input
                type="text"
                value={insuranceName}
                onChange={(e) => setInsuranceName(e.target.value)}
                className="input"
                placeholder="Digite o nome do convênio"
                required
              />
            </div>
          )}

          <div className="field">
            <label className="label">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea"
              placeholder="Digite observações da consulta"
            />
          </div>

          <div className="field">
            <label className="label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Appointment["status"])}
              className="select"
            >
              <option value="SCHEDULED">Agendada</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="CANCELED">Cancelada</option>
              <option value="COMPLETED">Concluída</option>
            </select>
          </div>

          <div className="actions" style={{ marginTop: 16 }}>
            <button type="submit" className="button button-primary">
              {editingId ? "Salvar Alterações" : "Salvar Consulta"}
            </button>

            {editingId && (
              <button
                type="button"
                className="button button-secondary"
                onClick={resetForm}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>

        <section className="form-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Calendário Semanal
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
                  borderCollapse: "collapse",
                  minWidth: 1100,
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #d1fae5",
                        padding: 12,
                        background: "#ecfdf5",
                        textAlign: "left",
                        width: 90,
                      }}
                    >
                      Horário
                    </th>

                    {weekDays.map((day) => (
                      <th
                        key={day.toISOString()}
                        style={{
                          border: isToday(day)
                            ? "2px solid #16a34a"
                            : "1px solid #d1fae5",
                          padding: 12,
                          background: isToday(day) ? "#dcfce7" : "#ecfdf5",
                          textAlign: "left",
                          verticalAlign: "top",
                        }}
                      >
                        {formatWeekday(day)}
                        {isToday(day) && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#166534",
                              marginTop: 4,
                            }}
                          >
                            Hoje
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      <td
                        style={{
                          border: "1px solid #d1fae5",
                          padding: 10,
                          fontWeight: 600,
                          color: "#166534",
                          background: "#f0fdf4",
                          verticalAlign: "top",
                        }}
                      >
                        {time}
                      </td>

                      {weekDays.map((day) => {
                        const dayKey = formatDateInput(day);

                        const cellAppointments = appointments.filter((appointment) => {
                          return (
                            getAppointmentDayKey(appointment.date) === dayKey &&
                            getAppointmentTime(appointment.date) === time
                          );
                        });

                        return (
                          <td
                            key={`${dayKey}-${time}`}
                            onClick={() => handleCellClick(day, time)}
                            style={{
                              border: isToday(day)
                                ? "2px solid #bbf7d0"
                                : "1px solid #d1fae5",
                              padding: 8,
                              verticalAlign: "top",
                              minHeight: 90,
                              background: isToday(day) ? "#f7fee7" : "#ffffff",
                              cursor: "pointer",
                            }}
                          >
                            {cellAppointments.length === 0 ? (
                              <div style={{ color: "#9ca3af", fontSize: 12 }}>
                                Clique para agendar
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 8,
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {cellAppointments.map((appointment) => {
                                  const statusStyle = getStatusStyles(
                                    appointment.status
                                  );
                                  const isEditing = editingId === appointment.id;

                                  return (
                                    <div
                                      key={appointment.id}
                                      onClick={() => handleEditAppointment(appointment)}
                                      style={{
                                        border: isEditing
                                          ? "2px solid #16a34a"
                                          : `1px solid ${statusStyle.border}`,
                                        background: statusStyle.background,
                                        borderRadius: 10,
                                        padding: 8,
                                        fontSize: 12,
                                        cursor: "pointer",
                                        boxShadow: isEditing
                                          ? "0 0 0 2px rgba(22,163,74,0.15)"
                                          : "none",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight: 700,
                                          color: statusStyle.title,
                                        }}
                                      >
                                        {appointment.patient.fullName}
                                      </div>

                                      <div>
                                        <strong>Status:</strong>{" "}
                                        {getStatusLabel(appointment.status)}
                                      </div>

                                      <div>
                                        <strong>Tipo:</strong>{" "}
                                        {getAppointmentTypeLabel(
                                          appointment.appointmentType
                                        )}
                                      </div>

                                      {appointment.appointmentType === "CONVENIO" && (
                                        <div>
                                          <strong>Convênio:</strong>{" "}
                                          {appointment.insuranceName || "—"}
                                        </div>
                                      )}

                                      {appointment.notes && (
                                        <div>
                                          <strong>Obs:</strong> {appointment.notes}
                                        </div>
                                      )}

                                      <div
                                        style={{
                                          display: "flex",
                                          gap: 6,
                                          flexWrap: "wrap",
                                          marginTop: 8,
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          className="button button-green"
                                          onClick={() =>
                                            updateStatus(appointment.id, "CONFIRMED")
                                          }
                                        >
                                          Confirmar
                                        </button>

                                        <button
                                          type="button"
                                          className="button button-blue"
                                          onClick={() =>
                                            updateStatus(appointment.id, "COMPLETED")
                                          }
                                        >
                                          Concluir
                                        </button>

                                        <button
                                          type="button"
                                          className="button button-yellow"
                                          onClick={() =>
                                            updateStatus(appointment.id, "CANCELED")
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
      <AgendaPageContent />
    </Suspense>
  );
}