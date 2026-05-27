"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  patientName: string;
  date: string;
  status: string;
};

type MedicalRecord = {
  id: string;
  chiefComplaint?: string;
  createdAt: string;
  patient?: {
    fullName: string;
  };
};

export default function DashboardPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [records, setRecords] =
    useState<MedicalRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD DASHBOARD
  ========================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      /* CONSULTAS */

      const appointmentsResponse =
        await fetch(
          "https://medflow-mvp-production.up.railway.app/api/appointments"
        );

      const appointmentsData =
        appointmentsResponse.ok
          ? await appointmentsResponse.json()
          : [];

      /* PRONTUÁRIOS */

      const recordsResponse =
        await fetch(
          "https://medflow-mvp-production.up.railway.app/api/medical-records"
        );

      const recordsData =
        recordsResponse.ok
          ? await recordsResponse.json()
          : [];

      setAppointments(
        appointmentsData
      );

      setRecords(recordsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     STATS
  ========================================= */

  const todayAppointments =
    appointments.length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "COMPLETED"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status !==
        "COMPLETED"
    ).length;

  const totalRecords =
    records.length;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="sidebar-title">
          MedFlow
        </h1>

        <nav className="sidebar-menu">
          <a href="/dashboard">
            Dashboard
          </a>

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
        {/* HEADER */}
        <div
          style={{
            marginBottom: 32,
          }}
        >
          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            Dashboard Médico
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 10,
              fontSize: 16,
            }}
          >
            Visão geral da clínica e
            atendimentos.
          </p>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {/* CARD 1 */}
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "white",
            }}
          >
            <p
              style={{
                opacity: 0.9,
                marginBottom: 12,
              }}
            >
              Consultas Hoje
            </p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {
                todayAppointments
              }
            </h2>
          </div>

          {/* CARD 2 */}
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#16a34a,#22c55e)",
              color: "white",
            }}
          >
            <p
              style={{
                opacity: 0.9,
                marginBottom: 12,
              }}
            >
              Atendimentos Concluídos
            </p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {
                completedAppointments
              }
            </h2>
          </div>

          {/* CARD 3 */}
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#f59e0b,#fbbf24)",
              color: "white",
            }}
          >
            <p
              style={{
                opacity: 0.9,
                marginBottom: 12,
              }}
            >
              Pendentes
            </p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {
                pendingAppointments
              }
            </h2>
          </div>

          {/* CARD 4 */}
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#7c3aed,#8b5cf6)",
              color: "white",
            }}
          >
            <p
              style={{
                opacity: 0.9,
                marginBottom: 12,
              }}
            >
              Evoluções Clínicas
            </p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {totalRecords}
            </h2>
          </div>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: 24,
          }}
        >
          {/* AGENDA */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                Agenda do Dia
              </h2>

              <a
                href="/agenda"
                className="primary-button"
              >
                Ver Agenda
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
              }}
            >
              {appointments
                .slice(0, 6)
                .map(
                  (
                    appointment
                  ) => (
                    <div
                      key={
                        appointment.id
                      }
                      style={{
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius: 20,
                        padding: 20,
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontWeight: 800,
                              fontSize: 18,
                            }}
                          >
                            {
                              appointment.patientName
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                "#64748b",
                              marginTop: 6,
                            }}
                          >
                            {new Date(
                              appointment.date
                            ).toLocaleString(
                              "pt-BR"
                            )}
                          </p>
                        </div>

                        <div
                          style={{
                            background:
                              "#dbeafe",
                            color:
                              "#2563eb",
                            padding:
                              "8px 14px",
                            borderRadius: 12,
                            fontWeight: 700,
                          }}
                        >
                          {
                            appointment.status
                          }
                        </div>
                      </div>
                    </div>
                  )
                )}

              {appointments.length ===
                0 && (
                <div
                  style={{
                    textAlign:
                      "center",
                    padding: 30,
                    color:
                      "#64748b",
                  }}
                >
                  Nenhuma consulta
                  encontrada.
                </div>
              )}
            </div>
          </div>

          {/* LATERAL */}
          <div
            style={{
              display: "grid",
              gap: 24,
            }}
          >
            {/* ATALHOS */}
            <div className="card">
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 22,
                }}
              >
                Atalhos
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                <a
                  href="/agenda"
                  className="primary-button"
                >
                  📅 Nova Consulta
                </a>

                <a
                  href="/pacientes"
                  className="secondary-button"
                >
                  👤 Novo Paciente
                </a>

                <a
                  href="/prontuarios"
                  className="secondary-button"
                >
                  📄 Novo Prontuário
                </a>

                <a
                  href="/prescricoes"
                  className="secondary-button"
                >
                  💊 Nova Prescrição
                </a>
              </div>
            </div>

            {/* ÚLTIMAS EVOLUÇÕES */}
            <div className="card">
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 22,
                }}
              >
                Últimas Evoluções
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: 18,
                }}
              >
                {records
                  .slice(0, 5)
                  .map((record) => (
                    <div
                      key={record.id}
                      style={{
                        paddingBottom: 16,
                        borderBottom:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {
                          record.patient
                            ?.fullName
                        }
                      </p>

                      <p
                        style={{
                          color:
                            "#64748b",
                          marginTop: 6,
                          fontSize: 14,
                        }}
                      >
                        {
                          record.chiefComplaint
                        }
                      </p>

                      <p
                        style={{
                          color:
                            "#94a3b8",
                          marginTop: 8,
                          fontSize: 12,
                        }}
                      >
                        {new Date(
                          record.createdAt
                        ).toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  ))}

                {records.length ===
                  0 && (
                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#64748b",
                    }}
                  >
                    Nenhuma evolução.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div
            style={{
              marginTop: 24,
              color: "#64748b",
            }}
          >
            Carregando dashboard...
          </div>
        )}
      </main>
    </div>
  );
}