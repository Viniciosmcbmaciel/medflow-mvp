"use client";

import { useParams } from "next/navigation";

export default function ProntuarioPacientePage() {
  const params = useParams();

  const patientId = params.id;

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
            Prontuário do Paciente
          </h1>

          <div
            style={{
              marginBottom: 20,
            }}
          >
            <strong>
              ID do paciente:
            </strong>{" "}
            {patientId}
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <div className="card">
              <strong>
                Histórico Clínico
              </strong>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                Paciente com
                acompanhamento
                médico.
              </p>
            </div>

            <div className="card">
              <strong>
                Prescrições
              </strong>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                Dipirona 500mg
                prescrita.
              </p>
            </div>

            <div className="card">
              <strong>
                Exames
              </strong>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                Hemograma e raio-x
                anexados.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}