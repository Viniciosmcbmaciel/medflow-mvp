"use client";

import { useRouter } from "next/navigation";

const patients = [
  {
    id: 1,
    name: "João Silva",
  },
  {
    id: 2,
    name: "Maria Souza",
  },
];

export default function PacientesPage() {
  const router = useRouter();

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

      {/* CONTEÚDO */}
      <main className="main-content">
        <div className="card">
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            Pacientes
          </h1>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {patients.map(
              (patient) => (
                <div
                  key={patient.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding: 20,
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 18,
                    background:
                      "white",
                  }}
                >
                  <strong>
                    {patient.name}
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <button
                      className="primary-button"
                      onClick={() =>
                        router.push(
                          "/prontuarios"
                        )
                      }
                    >
                      Abrir prontuário
                    </button>

                    <button
                      className="primary-button"
                      onClick={() =>
                        router.push(
                          "/agenda"
                        )
                      }
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}