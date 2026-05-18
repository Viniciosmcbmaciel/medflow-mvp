"use client";

export default function ProntuariosPage() {
  return (
    <div className="dashboard-layout">
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

      <main className="main-content">
        <div className="card">
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            Prontuários
          </h1>

          <input
            placeholder="Buscar paciente..."
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              border:
                "1px solid #dbeafe",
              padding: "0 16px",
              marginBottom: 20,
            }}
          />

          <div className="card">
            <strong>
              João Silva
            </strong>

            <p
              style={{
                marginTop: 10,
              }}
            >
              Histórico médico,
              prescrições e exames.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}