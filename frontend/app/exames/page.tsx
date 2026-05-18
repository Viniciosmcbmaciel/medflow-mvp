"use client";

import {
  useRef,
  useState,
} from "react";

type Exam = {
  id: string;
  name: string;
};

export default function ExamesPage() {
  const examRef =
    useRef<HTMLDivElement>(null);

  const [patientName, setPatientName] =
    useState("João Silva");

  const [doctorName, setDoctorName] =
    useState("Dr. MedFlow");

  const [crm, setCrm] =
    useState("CRM 123456");

  const [cid, setCid] =
    useState("");

  const [clinicalReason, setClinicalReason] =
    useState("");

  const [priority, setPriority] =
    useState("Rotina");

  const [exams, setExams] =
    useState<Exam[]>([
      {
        id: "1",
        name: "",
      },
    ]);

  function addExam() {
    setExams([
      ...exams,
      {
        id: Date.now().toString(),
        name: "",
      },
    ]);
  }

  function updateExam(
    id: string,
    value: string
  ) {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === id
          ? {
              ...exam,
              name: value,
            }
          : exam
      )
    );
  }

  function removeExam(
    id: string
  ) {
    setExams((prev) =>
      prev.filter(
        (exam) =>
          exam.id !== id
      )
    );
  }

  function generatePDF() {
    window.print();
  }

  function saveExamRequest() {
    alert(
      "Solicitação salva com sucesso!"
    );
  }

  return (
    <div className="dashboard-layout">
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

          <a href="/exames">
            Exames
          </a>
        </nav>
      </aside>

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
                Solicitação de Exames
              </h1>

              <p
                style={{
                  color: "#64748b",
                  marginTop: 8,
                }}
              >
                Solicitação médica
                profissional.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <button
                className="secondary-button"
                onClick={
                  saveExamRequest
                }
              >
                💾 Salvar
              </button>

              <button
                className="primary-button"
                onClick={generatePDF}
              >
                📄 Gerar PDF
              </button>
            </div>
          </div>

          {/* FORM */}
          <div
            ref={examRef}
            style={{
              background:
                "#f0fdf4",
              border:
                "2px solid #dcfce7",
              borderRadius: 24,
              padding: 28,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr 1fr",
                gap: 18,
                marginBottom: 24,
              }}
            >
              <input
                className="modal-input"
                placeholder="Paciente"
                value={patientName}
                onChange={(e) =>
                  setPatientName(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="Médico"
                value={doctorName}
                onChange={(e) =>
                  setDoctorName(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="CRM"
                value={crm}
                onChange={(e) =>
                  setCrm(
                    e.target.value
                  )
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 18,
                marginBottom: 24,
              }}
            >
              <input
                className="modal-input"
                placeholder="CID"
                value={cid}
                onChange={(e) =>
                  setCid(
                    e.target.value
                  )
                }
              />

              <select
                className="modal-input"
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
              >
                <option>
                  Rotina
                </option>

                <option>
                  Urgente
                </option>

                <option>
                  Emergência
                </option>
              </select>
            </div>

            <textarea
              className="modal-input"
              placeholder="Justificativa clínica..."
              value={
                clinicalReason
              }
              onChange={(e) =>
                setClinicalReason(
                  e.target.value
                )
              }
              style={{
                minHeight: 120,
                marginBottom: 24,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                Exames Solicitados
              </h2>

              <button
                className="primary-button"
                onClick={addExam}
              >
                + Exame
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr auto",
                    gap: 12,
                  }}
                >
                  <input
                    className="modal-input"
                    placeholder="Nome do exame"
                    value={exam.name}
                    onChange={(e) =>
                      updateExam(
                        exam.id,
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={() =>
                      removeExam(
                        exam.id
                      )
                    }
                    style={{
                      background:
                        "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 14,
                      padding:
                        "0 18px",
                      cursor:
                        "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* ASSINATURA */}
            <div
              style={{
                marginTop: 50,
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