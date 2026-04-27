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

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getTimeSlots() {
  const slots: string[] = [];
  for (let h = 8; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 18) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function getTime(date: string) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function getDay(date: string) {
  return formatDateInput(new Date(date));
}

function getStatusLabel(status: string) {
  return {
    SCHEDULED: "Agendada",
    CONFIRMED: "Confirmada",
    CANCELED: "Cancelada",
    COMPLETED: "Concluída",
  }[status] || status;
}

export default function AgendaPage() {
  const { ready } = useRequireAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const slots = getTimeSlots();

  // 🔥 carregar tudo
  useEffect(() => {
    async function loadData() {
      const start = formatDateInput(weekDays[0]);
      const end = formatDateInput(addDays(weekDays[6], 1));

      const [apptRes, pRes, dRes] = await Promise.all([
        fetch(
          `${API_URL}/appointments?date_from=${start}&date_to=${end}`,
          { headers: getAuthHeaders() }
        ),
        fetch(`${API_URL}/patients`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/users/medicos`, {
          headers: getAuthHeaders(),
        }),
      ]);

      setAppointments(await apptRes.json());
      setPatients(await pRes.json());
      setDoctors(await dRes.json());
    }

    if (ready) loadData();
  }, [ready, weekStart]);

  async function loadAppointments() {
    const start = formatDateInput(weekDays[0]);
    const end = formatDateInput(addDays(weekDays[6], 1));

    const res = await fetch(
      `${API_URL}/appointments?date_from=${start}&date_to=${end}`,
      { headers: getAuthHeaders() }
    );

    setAppointments(await res.json());
  }

  async function createAppointment(day: Date, time: string) {
    const name = prompt("Digite o nome do paciente:");
    if (!name) return;

    const patient = patients.find((p) =>
      p.fullName.toLowerCase().includes(name.toLowerCase())
    );

    if (!patient) {
      alert("Paciente não encontrado");
      return;
    }

    const doctor = doctors[0];
    if (!doctor) {
      alert("Nenhum médico cadastrado");
      return;
    }

    const [h, m] = time.split(":");
    const date = new Date(day);
    date.setHours(Number(h), Number(m), 0, 0);

    await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        patientId: patient.id,
        professionalId: doctor.id,
        date: date.toISOString(),
        status: "SCHEDULED",
        appointmentType: "PARTICULAR",
      }),
    });

    loadAppointments();
  }

  async function updateStatus(id: string, status: string) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    await fetch(`${API_URL}/appointments/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...appt, status }),
    });

    loadAppointments();
  }

  async function deleteAppointment(id: string) {
    if (!confirm("Excluir consulta?")) return;

    await fetch(`${API_URL}/appointments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    loadAppointments();
  }

  function openPDF() {
    const start = formatDateInput(weekDays[0]);
    const end = formatDateInput(addDays(weekDays[6], 1));
    window.open(`${API_URL}/appointments/pdf?date_from=${start}&date_to=${end}`);
  }

  if (!ready) return <div className="container">Carregando...</div>;

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Agenda</h1>

        <div className="actions">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))}>
            ←
          </button>
          <button onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Hoje
          </button>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))}>
            →
          </button>

          <button onClick={openPDF}>📄 PDF</button>
        </div>

        <table style={{ width: "100%", marginTop: 20 }}>
          <thead>
            <tr>
              <th>Hora</th>
              {weekDays.map((d) => (
                <th key={d.toISOString()}>
                  {d.toLocaleDateString("pt-BR")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slots.map((time) => (
              <tr key={time}>
                <td>{time}</td>

                {weekDays.map((day) => {
                  const key = `${formatDateInput(day)}-${time}`;

                  const items = appointments.filter(
                    (a) =>
                      getDay(a.date) === formatDateInput(day) &&
                      getTime(a.date) === time
                  );

                  return (
                    <td
                      key={key}
                      onClick={() => {
                        setSelectedSlot(key);
                        if (items.length === 0) {
                          createAppointment(day, time);
                        }
                      }}
                      style={{
                        background:
                          selectedSlot === key ? "#ecfdf5" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {items.length === 0 && (
                        <div style={{ color: "#94a3b8" }}>Livre</div>
                      )}

                      {items.map((a) => (
                        <div
                          key={a.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(openId === a.id ? null : a.id);
                          }}
                          style={{
                            padding: 8,
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            marginBottom: 6,
                          }}
                        >
                          <strong>{a.patient.fullName}</strong>

                          {openId === a.id && (
                            <div style={{ marginTop: 10 }}>
                              <div>{getStatusLabel(a.status)}</div>

                              <div style={{ marginTop: 6 }}>
                                <button onClick={() => updateStatus(a.id, "CONFIRMED")}>
                                  ✔ Confirmar
                                </button>

                                <button onClick={() => updateStatus(a.id, "COMPLETED")}>
                                  ✔ Concluir
                                </button>

                                <button onClick={() => updateStatus(a.id, "CANCELED")}>
                                  ✖ Cancelar
                                </button>

                                <button onClick={() => deleteAppointment(a.id)}>
                                  🗑 Excluir
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}