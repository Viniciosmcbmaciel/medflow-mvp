"use client";

import { useState } from "react";

type Patient = {
  id: number;
  name: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  insurance: string;
};

export default function PacientesPage() {
  const [openModal, setOpenModal] =
    useState(false);

  const [patients, setPatients] =
    useState<Patient[]>([
      {
        id: 1,
        name: "João Silva",
        birthDate: "1990-05-10",
        cpf: "000.000.000-00",
        phone: "(61) 99999-9999",
        email: "joao@email.com",
        insurance: "Unimed",
      },
    ]);

  const [name, setName] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [insurance, setInsurance] =
    useState("");

  function createPatient() {
    if (!name) {
      alert(
        "Informe o nome do paciente"
      );

      return;
    }

    const newPatient = {
      id: Date.now(),
      name,
      birthDate,
      cpf,
      phone,
      email,
      insurance,
    };

    setPatients([
      ...patients,
      newPatient,
    ]);

    setOpenModal(false);

    setName("");
    setBirthDate("");
    setCpf("");
    setPhone("");
    setEmail("");
    setInsurance("");
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

      {/* CONTEÚDO */}
      <main className="main-content">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                Pacientes
              </h1>

              <p
                style={{
                  color: "#64748b",
                  marginTop: 6,
                }}
              >
                Gerencie os pacientes
                cadastrados.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setOpenModal(true)
              }
            >
              + Novo Paciente
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {patients.map(
              (patient) => (
                <div
                  key={patient.id}
                  style={{
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 20,
                    background:
                      "#ffffff",
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
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {patient.name}
                    </h2>

                    <p>
                      CPF:{" "}
                      {patient.cpf}
                    </p>

                    <p>
                      Convênio:{" "}
                      {
                        patient.insurance
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <a
                      href={`/prontuario/${patient.id}`}
                      className="primary-button"
                    >
                      Abrir
                      Prontuário
                    </a>

                    <a
                      href="/agenda"
                      className="primary-button"
                    >
                      Agendar
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {openModal && (
        <div className="premium-modal-overlay">
          <div
            className="premium-modal"
            style={{
              maxWidth: 650,
              padding: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                Novo Paciente
              </h2>

              <button
                className="primary-button"
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
              >
                Fechar
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <input
                className="modal-input"
                placeholder="Nome completo"
                value={name}
                onChange={(e) =>
                  setName(
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
                placeholder="CPF"
                value={cpf}
                onChange={(e) =>
                  setCpf(
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
                placeholder="E-mail"
                value={email}
                onChange={(e) =>
                  setEmail(
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

              <button
                className="primary-button"
                onClick={
                  createPatient
                }
              >
                Salvar Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}