"use client";

export default function HistoricoPage() {
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
            Histórico Clínico
          </h1>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <div className="card">
              <strong>
                14/05/2026
              </strong>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                Consulta de rotina
                realizada.
              </p>
            </div>

            <div className="card">
              <strong>
                10/05/2026
              </strong>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                Prescrição médica
                emitida.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}