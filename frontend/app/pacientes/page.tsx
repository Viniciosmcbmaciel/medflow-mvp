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
        maxWidth: 820,
        padding: 36,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Novo Paciente
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: 8,
            }}
          >
            Cadastre um novo
            paciente no sistema.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            setOpenModal(false)
          }
        >
          Fechar
        </button>
      </div>

      {/* FORM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 18,
        }}
      >
        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label className="form-label">
            Nome completo
          </label>

          <input
            className="modal-input"
            placeholder="Digite o nome completo"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="form-label">
            Data de nascimento
          </label>

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
        </div>

        <div>
          <label className="form-label">
            CPF
          </label>

          <input
            className="modal-input"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) =>
              setCpf(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="form-label">
            Telefone
          </label>

          <input
            className="modal-input"
            placeholder="(61) 99999-9999"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="form-label">
            E-mail
          </label>

          <input
            className="modal-input"
            placeholder="email@paciente.com"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label className="form-label">
            Convênio
          </label>

          <input
            className="modal-input"
            placeholder="Ex: Unimed, Bradesco Saúde..."
            value={insurance}
            onChange={(e) =>
              setInsurance(
                e.target.value
              )
            }
          />
        </div>
      </div>

            {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          gap: 12,
          marginTop: 32,
        }}
      >
        <button
          className="secondary-button"
          onClick={() =>
            setOpenModal(false)
          }
        >
          Cancelar
        </button>

        <button
          className="primary-button"
          onClick={createPatient}
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