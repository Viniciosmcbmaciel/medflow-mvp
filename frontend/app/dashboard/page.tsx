"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DashboardStats = {
  totalPatients: number;
  totalAppointments: number;
  totalRecords: number;
  totalPrescriptions: number;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalRecords: 0,
    totalPrescriptions: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [
        patientsResponse,
        appointmentsResponse,
        recordsResponse,
        prescriptionsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/patients`),
        fetch(`${API_URL}/appointments`),
        fetch(`${API_URL}/medical-records`),
        fetch(`${API_URL}/prescriptions`),
      ]);

      const patients = patientsResponse.ok
        ? await patientsResponse.json()
        : [];

      const appointments = appointmentsResponse.ok
        ? await appointmentsResponse.json()
        : [];

      const records = recordsResponse.ok
        ? await recordsResponse.json()
        : [];

      const prescriptions = prescriptionsResponse.ok
        ? await prescriptionsResponse.json()
        : [];

      setStats({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalRecords: records.length,
        totalPrescriptions: prescriptions.length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            Dashboard Médico
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 8,
            }}
          >
            Visão geral da clínica em tempo real.
          </p>
        </div>

        {loading ? (
          <div className="card">
            Carregando dashboard...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: 20,
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
                <h3>Total de Pacientes</h3>

                <h1
                  style={{
                    fontSize: 42,
                    marginTop: 16,
                  }}
                >
                  {stats.totalPatients}
                </h1>
              </div>

              <div
                className="card"
                style={{
                  background:
                    "linear-gradient(135deg,#16a34a,#22c55e)",
                  color: "white",
                }}
              >
                <h3>Consultas</h3>

                <h1
                  style={{
                    fontSize: 42,
                    marginTop: 16,
                  }}
                >
                  {stats.totalAppointments}
                </h1>
              </div>

              <div
                className="card"
                style={{
                  background:
                    "linear-gradient(135deg,#f59e0b,#fbbf24)",
                  color: "white",
                }}
              >
                <h3>Prontuários</h3>

                <h1
                  style={{
                    fontSize: 42,
                    marginTop: 16,
                  }}
                >
                  {stats.totalRecords}
                </h1>
              </div>

              <div
                className="card"
                style={{
                  background:
                    "linear-gradient(135deg,#7c3aed,#8b5cf6)",
                  color: "white",
                }}
              >
                <h3>Prescrições</h3>

                <h1
                  style={{
                    fontSize: 42,
                    marginTop: 16,
                  }}
                >
                  {stats.totalPrescriptions}
                </h1>
              </div>
            </div>

            <div
              className="card"
              style={{
                marginTop: 30,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                Resumo Operacional
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(300px,1fr))",
                  gap: 20,
                }}
              >
                <div>
                  <strong>Pacientes cadastrados</strong>
                  <p>{stats.totalPatients}</p>
                </div>

                <div>
                  <strong>Consultas registradas</strong>
                  <p>{stats.totalAppointments}</p>
                </div>

                <div>
                  <strong>Prontuários emitidos</strong>
                  <p>{stats.totalRecords}</p>
                </div>

                <div>
                  <strong>Prescrições realizadas</strong>
                  <p>{stats.totalPrescriptions}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}