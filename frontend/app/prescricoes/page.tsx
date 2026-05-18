"use client";

import { useState } from "react";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
};

export default function PrescricoesPage() {
  const [patientName, setPatientName] =
    useState("João Silva");

  const [crm, setCrm] =
    useState("CRM 123456");

  const [doctorName, setDoctorName] =
    useState("Dr. MedFlow");

  const [notes, setNotes] =
    useState("");

  const [medications, setMedications] =
    useState<Medication[]>([
      {
        id: "1",
        name: "",
        dosage: "",
        duration: "",
      },
    ]);

  function addMedication() {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: "",
        dosage: "",
        duration: "",
      },
    ]);
  }

  function removeMedication(id: string) {
    setMedications((prev) =>
      prev.filter(
        (med) => med.id !== id
      )
    );
  }

  function updateMedication(
    id: string,
    field:
      | "name"
      | "dosage"
      | "duration",
    value: string
  ) {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? {
              ...med,
              [field]: value,
            }
          : med
      )
    );
  }

  function printPrescription() {
    window.print();
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
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                }}
              >
                Prescrição Médica
              </h1>

              <p
                style={{
                  color: "#64748b",
                  marginTop: 8,
                }}
              >
                Prescrição digital
                editável do paciente.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={
                printPrescription
              }
            >
              📄 Imprimir / PDF
            </button>
          </div>

          {/* PACIENTE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: 18,
              marginBottom: 28,
            }}
          >
            <div>
              <label className="form-label">
                Paciente
              </label>

              <input
                className="modal-input"
                value={patientName}
                onChange={(e) =>
                  setPatientName(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Médico
              </label>

              <input
                className="modal-input"
                value={doctorName}
                onChange={(e) =>
                  setDoctorName(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                CRM
              </label>

              <input
                className="modal-input"
                value={crm}
                onChange={(e) =>
                  setCrm(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* RECEITUARIO */}
          <div
            style={{
              border:
                "2px solid #dcfce7",
              borderRadius: 24,
              padding: 28,
              background: "#f0fdf4",
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
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                Medicamentos
              </h2>

              <button
                className="primary-button"
                onClick={addMedication}
              >
                + Medicamento
              </button>
            </div>

            {/* MEDICAMENTOS */}
            <div
              style={{
                display: "grid",
                gap: 20,
              }}
            >
              {medications.map(
                (medication) => (
                  <div
                    key={
                      medication.id
                    }
                    style={{
                      background:
                        "white",
                      borderRadius: 18,
                      padding: 20,
                      border:
                        "1px solid #dcfce7",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "2fr 2fr 1fr auto",
                        gap: 14,
                        alignItems:
                          "end",
                      }}
                    >
                      <div>
                        <label className="form-label">
                          Medicamento
                        </label>

                        <input
                          className="modal-input"
                          placeholder="Ex: Dipirona 1g"
                          value={
                            medication.name
                          }
                          onChange={(
                            e
                          ) =>
                            updateMedication(
                              medication.id,
                              "name",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className="form-label">
                          Posologia
                        </label>

                        <input
                          className="modal-input"
                          placeholder="1 comprimido 6/6h"
                          value={
                            medication.dosage
                          }
                          onChange={(
                            e
                          ) =>
                            updateMedication(
                              medication.id,
                              "dosage",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className="form-label">
                          Duração
                        </label>

                        <input
                          className="modal-input"
                          placeholder="7 dias"
                          value={
                            medication.duration
                          }
                          onChange={(
                            e
                          ) =>
                            updateMedication(
                              medication.id,
                              "duration",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>

                      <button
                        onClick={() =>
                          removeMedication(
                            medication.id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",
                          color: "white",
                          border:
                            "none",
                          padding:
                            "14px 16px",
                          borderRadius: 14,
                          cursor:
                            "pointer",
                          fontWeight: 700,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* OBSERVACOES */}
            <div
              style={{
                marginTop: 28,
              }}
            >
              <label className="form-label">
                Observações médicas
              </label>

              <textarea
                className="modal-input"
                placeholder="Orientações adicionais ao paciente..."
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                style={{
                  minHeight: 140,
                  resize: "vertical",
                }}
              />
            </div>

            {/* ASSINATURA */}
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop:
                  "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  width: 280,
                }}
              >
                <div
                  style={{
                    borderTop:
                      "1px solid #0f172a",
                    marginBottom: 8,
                  }}
                />

                <strong>
                  {doctorName}
                </strong>

                <p
                  style={{
                    color: "#64748b",
                  }}
                >
                  {crm}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}