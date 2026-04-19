"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, getStoredUser } from "../lib/auth";

export default function AppHeader() {
  const router = useRouter();
  const user = getStoredUser();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">MedFlow</div>

        <nav className="nav">
          <Link href="/" className="nav-link">
            Início
          </Link>

          <Link href="/pacientes" className="nav-link">
            Pacientes
          </Link>

          <Link href="/novo-paciente" className="nav-link">
            Novo Paciente
          </Link>

          <Link href="/agenda" className="nav-link">
            Agenda
          </Link>

          <Link href="/configuracoes-agenda" className="nav-link">
            Config. Agenda
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/usuarios" className="nav-link">
              Usuários
            </Link>
          )}

          <button
            type="button"
            className="nav-link"
            onClick={handleLogout}
            style={{
              border: "none",
              cursor: "pointer",
              background: "#ecfdf5",
            }}
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}