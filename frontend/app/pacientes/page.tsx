"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://medflow-mvp-production.up.railway.app/api";

type Patient = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  insurance: string;
  email: string;
};

export default function PacientesPage() {
  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [insurance, setInsurance] =
    useState("");

  const [email, setEmail] =
    useState("");

  /* =========================================
     CARREGAR
  ========================================= */

  async function loadPatients() {
    try {
      const response = await fetch(
        `${API_URL}/patients`
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar pacientes"
        );
      }

      const data =
        await response.json();

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  /* =========================================
     CADASTRAR
  ========================================= */

  async function createPatient() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/patients`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName,
            cpf,
            birthDate,
            phone,
            insurance,
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erro ao cadastrar"
        );
      }

      alert(
        "Paciente cadastrado com sucesso!"
      );

      setFullName("");
      setCpf("");
      setBirthDate("");
      setPhone("");
      setInsurance("");
      setEmail("");

      loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao cadastrar paciente"
      );
    } finally {
      setLoading(false);
    }
  }

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

      {/* MAIN */}
      <main className="main-content">
        <div className="card">
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              marginBottom: 12,
            }}
          >
            Pacientes
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 32,
            }}
          >
            Cadastro hospitalar de
            pacientes.
          </p>

          {/* FORM */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 24,
              border:
                "1px solid #e2e8f0",
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <input
                className="modal-input"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="CPF"
                value={cpf}
                onChange={(e) =>
                  setCpf(
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                className="modal-input"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="Telefone"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="Convênio"
                value={insurance}
                onChange={(e) =>
                  setInsurance(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="primary-button"
              style={{
                marginTop: 20,
              }}
              onClick={
                createPatient
              }
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Cadastrar Paciente"}
            </button>
          </div>

          {/* LISTA */}
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {patients.map(
              (patient) => (
                <div
                  key={patient.id}
                  style={{
                    background:
                      "white",
                    borderRadius: 22,
                    padding: 22,
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {
                      patient.fullName
                    }
                  </h2>

                  <p>
                    CPF:{" "}
                    {patient.cpf}
                  </p>

                  <p>
                    Telefone:{" "}
                    {patient.phone}
                  </p>

                  <p>
                    Convênio:{" "}
                    {
                      patient.insurance
                    }
                  </p>

                  <p>
                    Email:{" "}
                    {patient.email}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}