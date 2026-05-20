"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
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
  const [loading, setLoading] =
    useState(false);

  const [patients, setPatients] =
    useState<Patient[]>([]);

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
     BUSCAR PACIENTES
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
     CADASTRAR PACIENTE
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
        alert(
          data.message ||
            "Erro ao cadastrar paciente"
        );

        return;
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
          {/* HEADER */}
          <div
            style={{
              marginBottom: 32,
            }}
          >
            <h1
              style={{
                fontSize: 38,
                fontWeight: 900,
              }}
            >
              Pacientes
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: 10,
              }}
            >
              Cadastro e gestão
              hospitalar de pacientes.
            </p>
          </div>

          {/* FORM */}
          <div
            style={{
              background: "white",
              padding: 28,
              borderRadius: 24,
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
                gap: 18,
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
                placeholder="E-mail"
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
                marginTop: 24,
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
                    padding: 24,
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <div>
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

                      <p
                        style={{
                          color:
                            "#64748b",
                          marginTop: 6,
                        }}
                      >
                        CPF:{" "}
                        {patient.cpf}
                      </p>

                      <p
                        style={{
                          color:
                            "#64748b",
                        }}
                      >
                        Telefone:{" "}
                        {
                          patient.phone
                        }
                      </p>

                      <p
                        style={{
                          color:
                            "#64748b",
                        }}
                      >
                        Convênio:{" "}
                        {
                          patient.insurance
                        }
                      </p>

                      <p
                        style={{
                          color:
                            "#64748b",
                        }}
                      >
                        Email:{" "}
                        {
                          patient.email
                        }
                      </p>
                    </div>

                    <a
                      href={`/prontuarios/${patient.id}`}
                      className="primary-button"
                      style={{
                        textDecoration:
                          "none",
                      }}
                    >
                      Abrir Prontuário
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}