"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { medicationsDatabase } from "../data/medications";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
};

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
};

type PrescriptionHistory = {
  id: string;
  createdAt: string;

  items: {
    id: string;
    medication: string;
    dosage: string;
    duration?: string;
  }[];
};

export default function PrescricoesPage() {
  const prescriptionRef =
    useRef<HTMLDivElement>(null);

  /* =========================================
     PACIENTE
  ========================================= */

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [
    medicalRecordId,
    setMedicalRecordId,
  ] = useState("");

  const [history, setHistory] =
    useState<PrescriptionHistory[]>(
      []
    );

  /* =========================================
     AUTOCOMPLETE PREMIUM
  ========================================= */

  const [
    activeSuggestions,
    setActiveSuggestions,
  ] = useState<string[]>([]);

  const [
    activeMedicationId,
    setActiveMedicationId,
  ] = useState<string | null>(
    null
  );

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

    setPatientName(
      parsed.fullName || ""
    );

    setPatientCpf(
      parsed.cpf || ""
    );

    setPatientBirthDate(
      parsed.birthDate || ""
    );

    loadHistory(parsed.id);

    loadLatestMedicalRecord(
      parsed.id
    );
  }, []);

  async function loadHistory(
    patientId: string
  ) {
    try {
      const response = await fetch(
        `https://medflow-mvp-production.up.railway.app/api/prescriptions/patient/${patientId}`
      );

      if (!response.ok) return;

      const data =
        await response.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadLatestMedicalRecord(
    patientId: string
  ) {
    try {
      const response = await fetch(
        `https://medflow-mvp-production.up.railway.app/api/medical-records/patient/${patientId}`
      );

      if (!response.ok) return;

      const data: MedicalRecord[] =
        await response.json();

      if (data.length > 0) {
        setMedicalRecordId(
          data[0].id
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     CLÍNICA
  ========================================= */

  const [clinicName] =
    useState("MedFlow Clinic");

  const [clinicAddress] =
    useState("Brasília - DF");

  const [clinicPhone] =
    useState("(61) 99999-9999");

  /* =========================================
     PACIENTE FORM
  ========================================= */

  const [patientName, setPatientName] =
    useState("");

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
     MÉDICO
  ========================================= */

  const [crm] =
    useState("CRM 123456");

  const [doctorName] =
    useState("Dr. MedFlow");

  /* =========================================
     OBSERVAÇÕES
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

    /* AUTOCOMPLETE */

    if (field === "name") {
      setActiveMedicationId(id);

      if (!value.trim()) {
        setActiveSuggestions([]);
        return;
      }

      const filtered =
        medicationsDatabase.filter(
          (medication) =>
            medication.name
              .toLowerCase()
              .includes(
                value.toLowerCase()
              )
        );

      setActiveSuggestions(
        filtered.map(
          (medication) =>
            medication.name
        )
      );
    }
  }

  function selectMedication(
    medicationName: string
  ) {
    if (!activeMedicationId) return;

    const medicationData =
      medicationsDatabase.find(
        (medication) =>
          medication.name ===
          medicationName
      );

    setMedications((prev) =>
      prev.map((med) =>
        med.id === activeMedicationId
          ? {
              ...med,

              name:
                medicationData?.name ||
                medicationName,

              dosage:
                medicationData?.dosage ||
                "",

              duration:
                medicationData?.duration ||
                "",
            }
          : med
      )
    );

    setActiveSuggestions([]);
  }

  /* =========================================
     TEMPLATES
  ========================================= */

  function applyQuickTemplate(
    type: string
  ) {
    if (type === "gripe") {
      setMedications([
        {
          id: Date.now().toString(),
          name:
            "Paracetamol 750mg",
          dosage:
            "1 comprimido de 6/6h",
          duration: "5 dias",
        },
        {
          id: (
            Date.now() + 1
          ).toString(),
          name:
            "Ibuprofeno 600mg",
          dosage:
            "1 comprimido de 8/8h",
          duration: "5 dias",
        },
      ]);

      setCid("J11");
    }

    if (type === "sinusite") {
      setMedications([
        {
          id: Date.now().toString(),
          name:
            "Amoxicilina 500mg",
          dosage:
            "1 cápsula de 8/8h",
          duration: "7 dias",
        },
      ]);

      setCid("J01");
    }

    if (type === "dor") {
      setMedications([
        {
          id: Date.now().toString(),
          name:
            "Dipirona 500mg",
          dosage:
            "1 comprimido se dor",
          duration: "3 dias",
        },
      ]);
    }
  }

  /* =========================================
     SALVAR
  ========================================= */

  async function savePrescription() {
    try {
      if (!patient) {
        alert(
          "Selecione um paciente primeiro."
        );

        return;
      }

      if (!medicalRecordId) {
        alert(
          "Nenhum prontuário encontrado."
        );

        return;
      }

      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/prescriptions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            medicalRecordId,

            notes: `
CID: ${cid}

Peso: ${weight}

Alergias: ${allergies}

${notes}
            `,

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
        "Prescrição salva!"
      );

      setNotes("");

      setCid("");

      setWeight("");

      setAllergies("");

      setMedications([
        {
          id: "1",
          name: "",
          dosage: "",
          duration: "",
        },
      ]);

      if (patient?.id) {
        loadHistory(patient.id);
      }
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
                📄 PDF
              </button>
            </div>
          </div>

          {/* TEMPLATES */}

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <button
              className="secondary-button"
              onClick={() =>
                applyQuickTemplate(
                  "gripe"
                )
              }
            >
              🤧 Gripe
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                applyQuickTemplate(
                  "sinusite"
                )
              }
            >
              🫁 Sinusite
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                applyQuickTemplate(
                  "dor"
                )
              }
            >
              💊 Dor
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
                    position:
                      "relative",
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
                    }}
                  >
                    <div
                      style={{
                        position:
                          "relative",
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

                      {activeMedicationId ===
                        medication.id &&
                        activeSuggestions.length >
                          0 && (
                          <div
                            style={{
                              position:
                                "absolute",
                              top: 58,
                              left: 0,
                              right: 0,
                              background:
                                "white",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: 12,
                              zIndex: 999,
                            }}
                          >
                            {activeSuggestions.map(
                              (
                                suggestion
                              ) => (
                                <div
                                  key={
                                    suggestion
                                  }
                                  onClick={() =>
                                    selectMedication(
                                      suggestion
                                    )
                                  }
                                  style={{
                                    padding: 12,
                                    cursor:
                                      "pointer",
                                  }}
                                >
                                  {
                                    suggestion
                                  }
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <input
                      className="modal-input"
                      placeholder="Posologia"
                      value={
                        medication.dosage
                      }
                      onChange={(e) =>
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
                      onChange={(e) =>
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
                    >
                      ✕
                    </button>
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