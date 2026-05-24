"use client";

import {
  useEffect,
  useState,
} from "react";

type Patient = {
  id: string;
  fullName: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  insurance?: string;
};

type MedicalRecord = {
  id: string;
  patientId: string;
  complaint: string;
  diagnosis: string;
  observations: string;
  createdAt: string;
};

export default function ProntuariosPage() {
  /* =========================================
     STATES
  ========================================= */

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [filteredPatients, setFilteredPatients] =
    useState<Patient[]>([]);

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [search, setSearch] =
    useState("");

  const [complaint, setComplaint] =
    useState("");

  const [diagnosis, setDiagnosis] =
    useState("");

  const [observations, setObservations] =
    useState("");

  const [records, setRecords] =
    useState<MedicalRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     LOAD PATIENTS
  ========================================= */

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/patients"
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     SEARCH PATIENT
  ========================================= */

  function handleSearch(
    value: string
  ) {
    setSearch(value);

    if (!value) {
      setFilteredPatients([]);
      return;
    }

    const filtered =
      patients.filter((patient) =>
        patient.fullName
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )
      );

    setFilteredPatients(filtered);
  }

  /* =========================================
     SELECT PATIENT
  ========================================= */

  async function selectPatient(
    patient: Patient
  ) {
    setSelectedPatient(patient);

    setSearch(patient.fullName);

    setFilteredPatients([]);

    await loadMedicalRecords(
      patient.id
    );
  }

  /* =========================================
     LOAD RECORDS
  ========================================= */

  async function loadMedicalRecords(
    patientId: string
  ) {
    try {
      const response = await fetch(
        `https://medflow-mvp-production.up.railway.app/api/medical-records/patient/${patientId}`
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     SAVE RECORD
  ========================================= */

  async function saveMedicalRecord() {
  if (!selectedPatient) {
    alert(
      "Selecione um paciente"
    );

    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "https://medflow-mvp-production.up.railway.app/api/medical-records",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          patientId:
            selectedPatient.id,

          chiefComplaint:
            complaint,

          diagnosis,

          evolution:
            observations,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(data);

      throw new Error(
        data.error ||
          "Erro ao salvar prontuário"
      );
    }

    alert(
      "Prontuário salvo com sucesso!"
    );

    setComplaint("");

    setDiagnosis("");

    setObservations("");

    await loadMedicalRecords(
      selectedPatient.id
    );
  } catch (error) {
    console.error(error);

    alert(
      "Erro ao salvar prontuário"
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
          <div
            style={{
              marginBottom: 28,
            }}
          >
            <h1
              style={{
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              Prontuário Eletrônico
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: 8,
              }}
            >
              Sistema clínico de evolução médica.
            </p>
          </div>

          {/* BUSCA */}
          <div
            style={{
              position: "relative",
              marginBottom: 30,
            }}
          >
            <input
              className="modal-input"
              placeholder="Pesquisar paciente..."
              value={search}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
            />

            {filteredPatients.length >
              0 && (
              <div
                style={{
                  position:
                    "absolute",

                  top: 60,

                  left: 0,

                  right: 0,

                  background:
                    "white",

                  border:
                    "1px solid #e2e8f0",

                  borderRadius: 16,

                  overflow:
                    "hidden",

                  zIndex: 999,

                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                {filteredPatients.map(
                  (patient) => (
                    <div
                      key={patient.id}
                      onClick={() =>
                        selectPatient(
                          patient
                        )
                      }
                      style={{
                        padding: 16,

                        cursor:
                          "pointer",

                        borderBottom:
                          "1px solid #f1f5f9",
                      }}
                    >
                      <strong>
                        {
                          patient.fullName
                        }
                      </strong>

                      <p
                        style={{
                          color:
                            "#64748b",

                          fontSize: 13,

                          marginTop: 4,
                        }}
                      >
                        CPF:{" "}
                        {patient.cpf}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* DADOS */}
          {selectedPatient && (
            <div
              style={{
                background:
                  "#f8fafc",

                border:
                  "1px solid #e2e8f0",

                borderRadius: 24,

                padding: 24,

                marginBottom: 30,
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 20,
                }}
              >
                Dados do Paciente
              </h2>

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "1fr 1fr 1fr",

                  gap: 18,
                }}
              >
                <div>
                  <strong>
                    Nome
                  </strong>

                  <p>
                    {
                      selectedPatient.fullName
                    }
                  </p>
                </div>

                <div>
                  <strong>
                    CPF
                  </strong>

                  <p>
                    {
                      selectedPatient.cpf
                    }
                  </p>
                </div>

                <div>
                  <strong>
                    Telefone
                  </strong>

                  <p>
                    {
                      selectedPatient.phone
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FORM */}
          {selectedPatient && (
            <div
              style={{
                display: "grid",
                gap: 20,
              }}
            >
              <div>
                <label className="form-label">
                  Queixa principal
                </label>

                <textarea
                  className="modal-input"
                  value={complaint}
                  onChange={(e) =>
                    setComplaint(
                      e.target.value
                    )
                  }
                  style={{
                    minHeight: 120,
                  }}
                />
              </div>

              <div>
                <label className="form-label">
                  Diagnóstico
                </label>

                <textarea
                  className="modal-input"
                  value={diagnosis}
                  onChange={(e) =>
                    setDiagnosis(
                      e.target.value
                    )
                  }
                  style={{
                    minHeight: 120,
                  }}
                />
              </div>

              <div>
                <label className="form-label">
                  Evolução /
                  Observações
                </label>

                <textarea
                  className="modal-input"
                  value={observations}
                  onChange={(e) =>
                    setObservations(
                      e.target.value
                    )
                  }
                  style={{
                    minHeight: 160,
                  }}
                />
              </div>

              <button
                className="primary-button"
                onClick={
                  saveMedicalRecord
                }
                disabled={loading}
              >
                {loading
                  ? "Salvando..."
                  : "Salvar Prontuário"}
              </button>
            </div>
          )}

          {/* HISTÓRICO */}
          {selectedPatient && (
            <div
              style={{
                marginTop: 40,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 20,
                }}
              >
                Histórico Clínico
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: 18,
                }}
              >
                {records.map(
                  (record) => (
                    <div
                      key={record.id}
                      style={{
                        background:
                          "white",

                        border:
                          "1px solid #e2e8f0",

                        borderRadius: 20,

                        padding: 24,
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 16,
                        }}
                      >
                        <strong>
                          Data:
                        </strong>{" "}
                        {new Date(
                          record.createdAt
                        ).toLocaleString(
                          "pt-BR"
                        )}
                      </div>

                      <div
                        style={{
                          marginBottom: 14,
                        }}
                      >
                        <strong>
                          Queixa:
                        </strong>

                        <p>
                          {
                            record.complaint
                          }
                        </p>
                      </div>

                      <div
                        style={{
                          marginBottom: 14,
                        }}
                      >
                        <strong>
                          Diagnóstico:
                        </strong>

                        <p>
                          {
                            record.diagnosis
                          }
                        </p>
                      </div>

                      <div>
                        <strong>
                          Observações:
                        </strong>

                        <p>
                          {
                            record.observations
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}