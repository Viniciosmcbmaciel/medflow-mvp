"use client";

export default function PrescricoesPage() {
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
            Prescrições
          </h1>

          <div className="card">
            <strong>
              Prescrição ativa
            </strong>

            <p
              style={{
                marginTop: 10,
              }}
            >
              Dipirona 500mg
              8/8h por 5 dias.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}