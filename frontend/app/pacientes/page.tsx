"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

type Patient = {
  id: string;
  fullName: string;
  cpf?: string;
  phone?: string;
  email?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("medflow_token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function PacientesContent() {
  const { ready } = useRequireAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadPatients() {
    try {
      setLoading(true);

      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL não configurada");
      }

      const res = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar pacientes");
      }

      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar pacientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ready) {
      loadPatients();
    }
  }, [ready]);

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Pacientes</h1>
        <p className="page-subtitle">
          Gerencie os pacientes cadastrados no sistema.
        </p>

        {loading ? (
          <div className="empty-state">Carregando pacientes...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">Nenhum paciente cadastrado.</div>
        ) : (
          <div className="list">
            {patients.map((patient) => (
              <div key={patient.id} className="item-card">
                <div className="item-title">{patient.fullName}</div>

                <div className="item-text">
                  <strong>CPF:</strong> {patient.cpf || "—"}
                </div>

                <div className="item-text">
                  <strong>Telefone:</strong> {patient.phone || "—"}
                </div>

                <div className="item-text">
                  <strong>Email:</strong> {patient.email || "—"}
                </div>

                <div className="actions" style={{ marginTop: 14 }}>
                  <Link
                    href={`/prontuario/${patient.id}`}
                    className="button button-green"
                  >
                    Abrir prontuário
                  </Link>

                  <Link href="/agenda" className="button button-blue">
                    Agendar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function PacientesPage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <PacientesContent />
    </Suspense>
  );
}