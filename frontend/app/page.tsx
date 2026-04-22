"use client";

import { Suspense } from "react";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import { useRequireAuth } from "../lib/auth";

function HomePageContent() {
  const { ready, user } = useRequireAuth();

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <div
          className="form-card"
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(37,99,235,0.06))",
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 8 }}>
            Olá, {user?.name}
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Bem-vindo ao MedFlow. Gerencie pacientes, agenda e prontuários com
            experiência SaaS profissional.
          </p>
        </div>

        <div className="grid-cards">
          <Link href="/pacientes" className="card">
            <div className="card-title">Pacientes</div>
            <div className="card-text">
              Visualize e acompanhe todos os pacientes cadastrados.
            </div>
          </Link>

          <Link href="/novo-paciente" className="card">
            <div className="card-title">Novo Paciente</div>
            <div className="card-text">
              Realize novos cadastros com rapidez e organização.
            </div>
          </Link>

          <Link href="/agenda" className="card">
            <div className="card-title">Agenda</div>
            <div className="card-text">
              Controle consultas em uma visualização profissional.
            </div>
          </Link>

          <Link href="/configuracoes-agenda" className="card">
            <div className="card-title">Configurações</div>
            <div className="card-text">
              Ajuste horários e parâmetros operacionais da agenda.
            </div>
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/usuarios" className="card">
              <div className="card-title">Usuários</div>
              <div className="card-text">
                Cadastre médicos e secretárias com controle administrativo.
              </div>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <HomePageContent />
    </Suspense>
  );
}