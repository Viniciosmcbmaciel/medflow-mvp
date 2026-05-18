"use client";

import {
  useRef,
  useState,
} from "react";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
};

export default function PrescricoesPage() {
  const prescriptionRef =
    useRef<HTMLDivElement>(null);

  /* =========================================
     CLINICA
  ========================================= */

  const [clinicName, setClinicName] =
    useState("MedFlow Clinic");

  const [
    clinicAddress,
    setClinicAddress,
  ] = useState(
    "Brasília - DF"
  );

  const [clinicPhone, setClinicPhone] =
    useState("(61) 99999-9999");

  /* =========================================
     PACIENTE
  ========================================= */

  const [patientName, setPatientName] =
    useState("João Silva");

  const [patientCpf, setPatientCpf] =
    useState("");

  const [
    patientBirthDate,
    setPatientBirthDate,
  ] = useState("");

  const [weight, setWeight] =
    useState("");

  const [allergies, setAllergies] =
    useState("");

  const [cid, setCid] =
    useState("");

  /* =========================================
     MEDICO
  ========================================= */

  const [crm, setCrm] =
    useState("CRM 123456");

  const [doctorName, setDoctorName] =
    useState("Dr. MedFlow");

  /* =========================================
     OBSERVACOES
  ========================================= */

  const [notes, setNotes] =
    useState("");

  /* =========================================
     MEDICAMENTOS
  ========================================= */

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

  function removeMedication(
    id: string
  ) {
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

  /* =========================================
     SALVAR
  ========================================= */

  async function savePrescription() {
  try {
    const response = await fetch(
      "https://medflow-mvp-production.up.railway.app/api/prescriptions",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          medicalRecordId:
            "cmoaotg830004l84e1urej5nv",

          notes,

          items: medications.map(
            (med) => ({
              medication:
                med.name,

              dosage:
                med.dosage,

              instructions:
                med.dosage,

              duration:
                med.duration,
            })
          ),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Erro ao salvar"
      );
    }

    alert(
      "Prescrição salva com sucesso!"
    );
  } catch (error) {
    console.error(error);

    alert(
      "Erro ao salvar prescrição"
    );
  }
}

  /* =========================================
     PDF
  ========================================= */

  function generatePDF() {
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
                Receita médica
                profissional da clínica.
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
                  savePrescription
                }
              >
                💾 Salvar
              </button>

              <button
                className="primary-button"
                onClick={
                  generatePDF
                }
              >
                📄 Gerar PDF
              </button>
            </div>
          </div>

          {/* RECEITUARIO */}
          <div
            ref={prescriptionRef}
            style={{
              border:
                "2px solid #dcfce7",

              borderRadius: 24,

              padding: 32,

              background: "#f0fdf4",
            }}
          >
            {/* CABECALHO */}
            <div
              style={{
                background: "white",

                borderRadius: 22,

                padding: 24,

                marginBottom: 28,

                border:
                  "1px solid #dcfce7",
              }}
            >
              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  marginBottom: 18,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 30,

                      fontWeight: 900,

                      color:
                        "#166534",
                    }}
                  >
                    {clinicName}
                  </h1>

                  <p
                    style={{
                      color:
                        "#64748b",

                      marginTop: 6,
                    }}
                  >
                    {
                      clinicAddress
                    }
                  </p>

                  <p
                    style={{
                      color:
                        "#64748b",
                    }}
                  >
                    {clinicPhone}
                  </p>
                </div>

                <div
                  style={{
                    width: 82,

                    height: 82,

                    borderRadius: 20,

                    background:
                      "linear-gradient(135deg,#16a34a,#22c55e)",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    color: "white",

                    fontSize: 28,

                    fontWeight: 900,
                  }}
                >
                  M
                </div>
              </div>

              {/* DADOS */}
              <div
                style={{
                  borderTop:
                    "1px solid #dcfce7",

                  paddingTop: 20,

                  display: "grid",

                  gridTemplateColumns:
                    "1fr 1fr 1fr",

                  gap: 18,
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
                  placeholder="CPF"
                  value={patientCpf}
                  onChange={(e) =>
                    setPatientCpf(
                      e.target.value
                    )
                  }
                />

                <input
                  type="date"
                  className="modal-input"
                  value={
                    patientBirthDate
                  }
                  onChange={(e) =>
                    setPatientBirthDate(
                      e.target.value
                    )
                  }
                />

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
                  placeholder="Alergias"
                  value={allergies}
                  onChange={(e) =>
                    setAllergies(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* HEADER MEDICAMENTOS */}
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
                onClick={
                  addMedication
                }
              >
                + Medicamento
              </button>
            </div>

            {/* LISTA */}
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

                      borderRadius: 20,

                      padding: 22,

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
                      <input
                        className="modal-input"
                        placeholder="Medicamento"
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

                      <input
                        className="modal-input"
                        placeholder="Posologia"
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

                      <input
                        className="modal-input"
                        placeholder="Duração"
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

                      <button
                        onClick={() =>
                          removeMedication(
                            medication.id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",

                          color:
                            "white",

                          border:
                            "none",

                          padding:
                            "14px 16px",

                          borderRadius: 14,

                          cursor:
                            "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* OBS */}
            <div
              style={{
                marginTop: 30,
              }}
            >
              <textarea
                className="modal-input"
                placeholder="Observações médicas..."
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                style={{
                  minHeight: 150,
                }}
              />
            </div>

            {/* ASSINATURA */}
            <div
              style={{
                marginTop: 50,

                paddingTop: 28,

                borderTop:
                  "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  width: 320,
                }}
              >
                <div
                  style={{
                    borderTop:
                      "1px solid #0f172a",

                    marginBottom: 10,
                  }}
                />

                <strong>
                  {doctorName}
                </strong>

                <p
                  style={{
                    color:
                      "#64748b",
                  }}
                >
                  {crm}
                </p>

                <p
                  style={{
                    color:
                      "#64748b",

                    fontSize: 13,

                    marginTop: 6,
                  }}
                >
                  Assinatura médica
                  digital
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}