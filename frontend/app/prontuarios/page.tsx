"use client";

import {
  useEffect,
  useState,
} from "react";

type MedicalRecord = {
  id: string;

  chiefComplaint: string;

  diagnosis: string;

  evolution: string;

  createdAt: string;
};

type Patient = {
  id: string;

  fullName: string;

  cpf?: string;

  birthDate?: string;

  phone?: string;

  insurance?: string;

  email?: string;
};

export default function ProntuariosPage() {
  /* =========================================
     PACIENTE
  ========================================= */

  const [patient, setPatient] =
    useState<Patient | null>(
      null
    );

  /* =========================================
     FORM
  ========================================= */

  const [
    chiefComplaint,
    setChiefComplaint,
  ] = useState("");

  const [diagnosis, setDiagnosis] =
    useState("");

  const [evolution, setEvolution] =
    useState("");

  /* =========================================
     HISTORICO
  ========================================= */

  const [history, setHistory] =
    useState<MedicalRecord[]>(
      []
    );

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     LOAD PATIENT
  ========================================= */

  useEffect(() => {
    const storedPatient =
      localStorage.getItem(
        "selected_patient"
      );

    if (storedPatient) {
      const parsed =
        JSON.parse(
          storedPatient
        );

      setPatient(parsed);

      loadHistory(parsed.id);
    }
  }, []);

  /* =========================================
     LOAD HISTORY
  ========================================= */

  async function loadHistory(
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

      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     SAVE RECORD
  ========================================= */

  async function saveRecord() {
    if (!patient) {
      alert(
        "Selecione um paciente"
      );

      return;
    }

    if (!chiefComplaint) {
      alert(
        "Informe a queixa principal"
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
              patient.id,

            chiefComplaint,

            diagnosis,

            evolution,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Erro ao salvar prontuário"
        );
      }

      alert(
        "Prontuário salvo com sucesso!"
      );

      setChiefComplaint("");

      setDiagnosis("");

      setEvolution("");

      loadHistory(patient.id);
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
          {/* HEADER */}
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
              Prontuário Médico
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: 8,
              }}
            >
              Gestão clínica
              integrada do paciente.
            </p>
          </div>

          {/* PACIENTE */}
          {patient && (
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
                  fontSize: 26,
                  fontWeight: 800,
                  marginBottom: 18,
                }}
              >
                Dados do Paciente
              </h2>

              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "1fr 1fr",

                  gap: 16,
                }}
              >
                <p>
                  <strong>
                    Nome:
                  </strong>{" "}
                  {
                    patient.fullName
                  }
                </p>

                <p>
                  <strong>
                    CPF:
                  </strong>{" "}
                  {patient.cpf}
                </p>

                <p>
                  <strong>
                    Telefone:
                  </strong>{" "}
                  {patient.phone}
                </p>

                <p>
                  <strong>
                    Convênio:
                  </strong>{" "}
                  {
                    patient.insurance
                  }
                </p>
              </div>
            </div>
          )}

          {/* FORM */}
          <div
            style={{
              display: "grid",
              gap: 24,
            }}
          >
            <div>
              <label className="form-label">
                Queixa principal
              </label>

              <textarea
                className="modal-input"
                value={
                  chiefComplaint
                }
                onChange={(e) =>
                  setChiefComplaint(
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
                value={evolution}
                onChange={(e) =>
                  setEvolution(
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
              onClick={saveRecord}
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Salvar Prontuário"}
            </button>
          </div>

          {/* HISTORICO */}
          <div
            style={{
              marginTop: 50,
            }}
          >
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Histórico Clínico
            </h2>

            <div
              style={{
                display: "grid",
                gap: 20,
              }}
            >
              {history.map(
                (record) => (
                  <div
                    key={record.id}
                    style={{
                      background:
                        "#f8fafc",

                      border:
                        "1px solid #e2e8f0",

                      borderRadius: 22,

                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 14,

                        color:
                          "#64748b",

                        fontSize: 14,
                      }}
                    >
                      {new Date(
                        record.createdAt
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 14,
                      }}
                    >
                      <div>
                        <strong>
                          Queixa:
                        </strong>

                        <p>
                          {
                            record.chiefComplaint
                          }
                        </p>
                      </div>

                      <div>
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
                          Evolução:
                        </strong>

                        <p>
                          {
                            record.evolution
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}

              {history.length ===
                0 && (
                <div
                  style={{
                    padding: 30,

                    textAlign:
                      "center",

                    color:
                      "#64748b",

                    background:
                      "#f8fafc",

                    borderRadius: 20,
                  }}
                >
                  Nenhum histórico
                  clínico encontrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}