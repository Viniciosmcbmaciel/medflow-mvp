"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  useEffect,
  useState,
} from "react";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const appointmentsResponse =
        await fetch(
          "https://medflow-mvp-production.up.railway.app/api/appointments"
        );

      const appointmentsData =
        appointmentsResponse.ok
          ? await appointmentsResponse.json()
          : [];

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
     METRICAS
  ========================================= */

  const completed =
    appointments.filter(
      (a) =>
        a.status ===
        "COMPLETED"
    ).length;

  const pending =
    appointments.filter(
      (a) =>
        a.status ===
        "SCHEDULED"
    ).length;

  const canceled =
    appointments.filter(
      (a) =>
        a.status ===
        "CANCELED"
    ).length;

  const chartData = [
    {
      name: "Concluídas",
      total: completed,
    },
    {
      name: "Pendentes",
      total: pending,
    },
    {
      name: "Canceladas",
      total: canceled,
    },
  ];

  const pieData = [
    {
      name: "Concluídas",
      value: completed,
      color: "#22c55e",
    },
    {
      name: "Pendentes",
      value: pending,
      color: "#f59e0b",
    },
    {
      name: "Canceladas",
      value: canceled,
      color: "#ef4444",
    },
  ];

  /* =========================================
     FINANCEIRO MOCK
  ========================================= */

  const dailyRevenue =
    completed * 250;

  const weeklyRevenue =
    dailyRevenue * 5;

  const monthlyRevenue =
    weeklyRevenue * 4;

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
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* HEADER */}
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            Dashboard Médico
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 10,
            }}
          >
            Painel clínico inteligente
            da clínica.
          </p>
        </div>

        {/* TOP CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "white",
            }}
          >
            <p>Consultas</p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              {
                appointments.length
              }
            </h2>
          </div>

          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#16a34a,#22c55e)",
              color: "white",
            }}
          >
            <p>Prontuários</p>

            <h2
              style={{
                fontSize: 42,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              {records.length}
            </h2>
          </div>

          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#f59e0b,#fbbf24)",
              color: "white",
            }}
          >
            <p>Faturamento Diário</p>

            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              R$ {dailyRevenue}
            </h2>
          </div>

          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#7c3aed,#8b5cf6)",
              color: "white",
            }}
          >
            <p>Faturamento Mensal</p>

            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                marginTop: 10,
              }}
            >
              R$ {monthlyRevenue}
            </h2>
          </div>
        </div>

        {/* GRAFICOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: 24,
            marginBottom: 28,
          }}
        >
          {/* BAR CHART */}
          <div className="card">
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Consultas da Clínica
            </h2>

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                >
                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    radius={[
                      10,
                      10,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE */}
          <div className="card">
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Status
            </h2>

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={110}
                  >
                    {pieData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.color
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ULTIMAS EVOLUCOES */}
        <div className="card">
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginBottom: 28,
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
                    background:
                      "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 20,
                    padding: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                        }}
                      >
                        {
                          record.patient
                            ?.fullName
                        }
                      </h3>

                      <p
                        style={{
                          marginTop: 8,
                          color:
                            "#64748b",
                        }}
                      >
                        {
                          record.chiefComplaint
                        }
                      </p>
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      {new Date(
                        record.createdAt
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </div>
                  </div>
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
                Nenhuma evolução
                encontrada.
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div
            style={{
              marginTop: 20,
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