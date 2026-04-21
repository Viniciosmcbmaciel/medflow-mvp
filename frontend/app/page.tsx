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
        <h1 className="page-title">Sistema de Prontuário Eletrônico</h1>
        <p className="page-subtitle">
          Bem-vindo, {user?.name}. Gestão de pacientes, agenda e prontuários.
        </p>

        <div className="grid-cards">
          <Link href="/pacientes" className="card">
            <div className="card-title">Pacientes</div>
            <div className="card-text">Visualize os pacientes cadastrados.</div>
          </Link>

          <Link href="/novo-paciente" className="card">
            <div className="card-title">Novo Paciente</div>
            <div className="card-text">Cadastre um novo paciente.</div>
          </Link>

          <Link href="/agenda" className="card">
            <div className="card-title">Agenda</div>
            <div className="card-text">Gerencie consultas médicas.</div>
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/usuarios" className="card">
              <div className="card-title">Usuários</div>
              <div className="card-text">
                Cadastre médicos e secretárias.
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