"use client";

export default function AgendaPage() {
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
        </nav>
      </aside>

      <main className="main-content">
        <div className="card">
          <h2
            style={{
              marginBottom: 20,
            }}
          >
            Agenda Médica
          </h2>

          <p>
            Sistema restaurado com
            layout original.
          </p>
        </div>
      </main>
    </div>
  );
}