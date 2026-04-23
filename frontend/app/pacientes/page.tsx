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

      const res = await fetch(`${API_URL}/patients`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao buscar pacientes");
      }

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
        <div
          className="form-card"
          style={{
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(22,163,74,0.07), rgba(37,99,235,0.05))",
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 8 }}>
            Pacientes
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Gerencie os pacientes cadastrados com organização e acesso rápido ao
            prontuário.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div
            className="form-card"
            style={{
              flex: 1,
              minWidth: 220,
              marginBottom: 0,
              padding: 18,
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>Total de pacientes</div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#0f172a",
                marginTop: 6,
              }}
            >
              {patients.length}
            </div>
          </div>

          <Link href="/novo-paciente" className="button button-primary">
            Novo paciente
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">Carregando pacientes...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">
            Nenhum paciente cadastrado ainda.
          </div>
        ) : (
          <div className="grid-cards">
            {patients.map((patient) => (
              <div key={patient.id} className="card">
                <div className="card-title">{patient.fullName}</div>

                <div className="item-text">
                  <strong>CPF:</strong> {patient.cpf || "—"}
                </div>

                <div className="item-text">
                  <strong>Telefone:</strong> {patient.phone || "—"}
                </div>

                <div className="item-text">
                  <strong>E-mail:</strong> {patient.email || "—"}
                </div>

                <div className="actions" style={{ marginTop: 16 }}>
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