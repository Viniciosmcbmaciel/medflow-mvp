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
  /* =========================================
     PACIENTE
  ========================================= */

  const [patient, setPatient] =
    useState<Patient | null>(
      null
    );

  /* =========================================
     FORM SOAP
  ========================================= */

  const [
    chiefComplaint,
    setChiefComplaint,
  ] = useState("");

  const [
    historyPresentIllness,
    setHistoryPresentIllness,
  ] = useState("");

  const [
    physicalExam,
    setPhysicalExam,
  ] = useState("");

  const [
    diagnosticHypothesis,
    setDiagnosticHypothesis,
  ] = useState("");

  const [conduct, setConduct] =
    useState("");

  const [
    prescription,
    setPrescription,
  ] = useState("");

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
     HISTORICO
  ========================================= */

  const [history, setHistory] =
    useState<MedicalRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

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
        "Prontuário salvo com sucesso!"
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
            Evolução Clínica
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

            <div>
              <label className="form-label">
                História da Doença Atual
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 140,
                }}
                value={
                  historyPresentIllness
                }
                onChange={(e) =>
                  setHistoryPresentIllness(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Exame Físico
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 140,
                }}
                value={physicalExam}
                onChange={(e) =>
                  setPhysicalExam(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Hipótese Diagnóstica
              </label>

              <input
                className="modal-input"
                placeholder="CID"
                value={cid}
                onChange={(e) =>
                  setCid(
                    e.target.value
                  )
                }
                style={{
                  marginBottom: 14,
                }}
              />

              <textarea
                className="modal-input"
                style={{
                  minHeight: 120,
                }}
                value={
                  diagnosticHypothesis
                }
                onChange={(e) =>
                  setDiagnosticHypothesis(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Conduta
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 120,
                }}
                value={conduct}
                onChange={(e) =>
                  setConduct(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Prescrição
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 120,
                }}
                value={prescription}
                onChange={(e) =>
                  setPrescription(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="form-label">
                Observações
              </label>

              <textarea
                className="modal-input"
                style={{
                  minHeight: 140,
                }}
                value={notes}
                onChange={(e) =>
                  setNotes(
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
                : "Salvar Evolução"}
            </button>
          </div>
        </div>

        {/* HISTORICO */}
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

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {history.map((record) => (
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
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          color: "#64748b",
        }}
      >
        {new Date(
          record.createdAt
        ).toLocaleString("pt-BR")}
      </div>

      <button
        className="secondary-button"
        onClick={() =>
          window.open(
            `https://medflow-mvp-production.up.railway.app/api/medical-records/pdf/${record.id}`,
            "_blank"
          )
        }
      >
        📄 Gerar PDF
      </button>
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
        <strong>HDA</strong>

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

        <p>
          {
            record.physicalExam
          }
        </p>
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
          {record.conduct}
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