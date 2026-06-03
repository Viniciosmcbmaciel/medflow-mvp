"use client";

export default function Sidebar() {
  return (
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

        <a href="/usuarios">
          Usuários
        </a>
      </nav>
    </aside>
  );
}