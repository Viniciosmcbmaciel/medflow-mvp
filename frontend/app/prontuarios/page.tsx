"use client";

import { useEffect, useState } from "react";

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
  chiefComplaint?: string;
  historyPresentIllness?: string;
  physicalExam?: string;
  diagnosticHypothesis?: string;
  conduct?: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
};

export default function ProntuariosPage() {
  const [patient, setPatient] =
    useState<Patient | null>(null);

  /* =========================================
     FORM SOAP
  ========================================= */

  const [chiefComplaint, setChiefComplaint] =
    useState("");

  const [
    historyPresentIllness,
    setHistoryPresentIllness,
  ] = useState("");

  const [physicalExam, setPhysicalExam] =
    useState("");

  const [
    diagnosticHypothesis,
    setDiagnosticHypothesis,
  ] = useState("");

  const [conduct, setConduct] =
    useState("");

  const [prescription, setPrescription] =
    useState("");

  const [notes, setNotes] =
    useState("");

  /* =========================================
     SINAIS VITAIS
  ========================================= */

  const [bloodPressure, setBloodPressure] =
    useState("");

  const [heartRate, setHeartRate] =
    useState("");

  const [temperature, setTemperature] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [height, setHeight] =
    useState("");

  const [cid, setCid] =
    useState("");

  /* =========================================
     HISTÓRICO
  ========================================= */

  const [history, setHistory] =
    useState<MedicalRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    editingRecord,
    setEditingRecord,
  ] = useState<string | null>(
    null
  );

  const [searchHistory, setSearchHistory] =
    useState("");

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    const storedPatient =
      localStorage.getItem(
        "selected_patient"
      );

    if (!storedPatient) return;

    const parsed =
      JSON.parse(storedPatient);

    setPatient(parsed);

    loadHistory(parsed.id);
  }, []);

  /* =========================================
     AUTO SAVE DRAFT
  ========================================= */

  useEffect(() => {
    const savedDraft =
      localStorage.getItem(
        "medical_draft"
      );

    if (!savedDraft) return;

    const draft =
      JSON.parse(savedDraft);

    setChiefComplaint(
      draft.chiefComplaint || ""
    );

    setHistoryPresentIllness(
      draft.historyPresentIllness ||
        ""
    );

    setPhysicalExam(
      draft.physicalExam || ""
    );

    setDiagnosticHypothesis(
      draft.diagnosticHypothesis ||
        ""
    );

    setConduct(
      draft.conduct || ""
    );

    setPrescription(
      draft.prescription || ""
    );

    setNotes(
      draft.notes || ""
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "medical_draft",
      JSON.stringify({
        chiefComplaint,
        historyPresentIllness,
        physicalExam,
        diagnosticHypothesis,
        conduct,
        prescription,
        notes,
      })
    );
  }, [
    chiefComplaint,
    historyPresentIllness,
    physicalExam,
    diagnosticHypothesis,
    conduct,
    prescription,
    notes,
  ]);

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

      const data =
        await response.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     EDITAR
  ========================================= */

  function loadRecordToEdit(
    record: MedicalRecord
  ) {
    setEditingRecord(
      record.id
    );

    setChiefComplaint(
      record.chiefComplaint || ""
    );

    setHistoryPresentIllness(
      record.historyPresentIllness ||
        ""
    );

    setPhysicalExam(
      record.physicalExam || ""
    );

    setDiagnosticHypothesis(
      record.diagnosticHypothesis ||
        ""
    );

    setConduct(
      record.conduct || ""
    );

    setPrescription(
      record.prescription || ""
    );

    setNotes(
      record.notes || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================
     EXCLUIR
  ========================================= */

  async function deleteRecord(
    id: string
  ) {
    const confirmDelete =
      confirm(
        "Deseja excluir esta evolução?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://medflow-mvp-production.up.railway.app/api/medical-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      alert(
        "Evolução excluída!"
      );

      if (patient?.id) {
        loadHistory(patient.id);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao excluir"
      );
    }
  }

  /* =========================================
     SAVE
  ========================================= */

  async function saveRecord() {
    if (!patient) {
      alert(
        "Paciente não selecionado"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        editingRecord
          ? `https://medflow-mvp-production.up.railway.app/api/medical-records/${editingRecord}`
          : "https://medflow-mvp-production.up.railway.app/api/medical-records",
        {
          method:
            editingRecord
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patientId:
              patient.id,

            chiefComplaint,

            historyPresentIllness,

            physicalExam: `
PA: ${bloodPressure}
FC: ${heartRate}
TEMP: ${temperature}
PESO: ${weight}
ALTURA: ${height}

${physicalExam}
            `,

            diagnosticHypothesis: `
CID: ${cid}

${diagnosticHypothesis}
            `,

            conduct,

            prescription,

            notes,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.log(data);

        throw new Error(
          "Erro ao salvar"
        );
      }

      alert(
        editingRecord
          ? "Evolução atualizada!"
          : "Prontuário salvo com sucesso!"
      );

      /* LIMPAR */

      setChiefComplaint("");

      setHistoryPresentIllness("");

      setPhysicalExam("");

      setDiagnosticHypothesis("");

      setConduct("");

      setPrescription("");

      setNotes("");

      setBloodPressure("");

      setHeartRate("");

      setTemperature("");

      setWeight("");

      setHeight("");

      setCid("");

      setEditingRecord(null);

      localStorage.removeItem(
        "medical_draft"
      );

      await loadHistory(
        patient.id
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
        {/* HEADER */}
        <div
          style={{
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontSize: 36,
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
            Registro clínico completo
            integrado ao paciente.
          </p>
        </div>

        {/* PACIENTE */}
        {patient && (
          <div
            className="card"
            style={{
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Dados do Paciente
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 14,
              }}
            >
              <p>
                <strong>Nome:</strong>{" "}
                {patient.fullName}
              </p>

              <p>
                <strong>CPF:</strong>{" "}
                {patient.cpf}
              </p>

              <p>
                <strong>Telefone:</strong>{" "}
                {patient.phone}
              </p>

              <p>
                <strong>Convênio:</strong>{" "}
                {patient.insurance}
              </p>
            </div>
          </div>
        )}

        {/* SINAIS VITAIS */}
        <div className="card">
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            Sinais Vitais
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <input
              className="modal-input"
              placeholder="PA"
              value={bloodPressure}
              onChange={(e) =>
                setBloodPressure(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="FC"
              value={heartRate}
              onChange={(e) =>
                setHeartRate(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="Temp"
              value={temperature}
              onChange={(e) =>
                setTemperature(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="Peso"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="Altura"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* SOAP */}
        <div
          className="card"
          style={{
            marginTop: 24,
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginBottom: 28,
            }}
          >
            {editingRecord
              ? "Editar Evolução"
              : "Evolução Clínica"}
          </h2>

          <div
            style={{
              display: "grid",
              gap: 24,
            }}
          >
            <div>
              <label className="form-label">
                Queixa Principal
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 100,
                }}
                value={
                  chiefComplaint
                }
                onChange={(e) =>
                  setChiefComplaint(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="primary-button"
              onClick={saveRecord}
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : editingRecord
                ? "Atualizar Evolução"
                : "Salvar Evolução"}
            </button>
          </div>
        </div>

        {/* HISTÓRICO */}
        <div
          style={{
            marginTop: 34,
          }}
        >
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            Timeline Clínica
          </h2>

          <input
            className="modal-input"
            placeholder="Pesquisar no histórico clínico..."
            value={searchHistory}
            onChange={(e) =>
              setSearchHistory(
                e.target.value
              )
            }
            style={{
              marginBottom: 20,
            }}
          />

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {history
              .filter((record) => {
                const content = `
                ${record.chiefComplaint}
                ${record.historyPresentIllness}
                ${record.diagnosticHypothesis}
                ${record.conduct}
                ${record.notes}
              `.toLowerCase();

                return content.includes(
                  searchHistory.toLowerCase()
                );
              })
              .map((record) => (
                <div
                  key={record.id}
                  className="card"
                >
                  {/* HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom: 20,
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#64748b",
                          marginBottom: 12,
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
                          display:
                            "inline-flex",
                          background:
                            "#dbeafe",
                          color: "#1d4ed8",
                          padding:
                            "6px 12px",
                          borderRadius:
                            999,
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        🏥 CID Clínico
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="secondary-button"
                        onClick={() =>
                          loadRecordToEdit(
                            record
                          )
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() =>
                          window.open(
                            `https://medflow-mvp-production.up.railway.app/api/medical-records/pdf/${record.id}`,
                            "_blank"
                          )
                        }
                      >
                        📄 PDF
                      </button>

                      <button
                        style={{
                          background:
                            "#ef4444",
                          color:
                            "white",
                          border:
                            "none",
                          borderRadius:
                            14,
                          padding:
                            "12px 16px",
                          cursor:
                            "pointer",
                          fontWeight: 700,
                        }}
                        onClick={() =>
                          deleteRecord(
                            record.id
                          )
                        }
                      >
                        🗑 Excluir
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div
                    style={{
                      display: "grid",
                      gap: 18,
                    }}
                  >
                    <div>
                      <strong>
                        Queixa Principal
                      </strong>

                      <p>
                        {
                          record.chiefComplaint
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        HDA
                      </strong>

                      <p>
                        {
                          record.historyPresentIllness
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Exame Físico
                      </strong>

                      <pre
                        style={{
                          whiteSpace:
                            "pre-wrap",
                          fontFamily:
                            "inherit",
                          lineHeight:
                            1.7,
                        }}
                      >
                        {
                          record.physicalExam
                        }
                      </pre>
                    </div>

                    <div>
                      <strong>
                        Hipótese Diagnóstica
                      </strong>

                      <p>
                        {
                          record.diagnosticHypothesis
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Conduta
                      </strong>

                      <p>
                        {
                          record.conduct
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Prescrição
                      </strong>

                      <p>
                        {
                          record.prescription
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Observações
                      </strong>

                      <p>
                        {record.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {history.length ===
              0 && (
              <div
                className="card"
                style={{
                  textAlign:
                    "center",
                  color: "#64748b",
                }}
              >
                Nenhum registro clínico
                encontrado.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}