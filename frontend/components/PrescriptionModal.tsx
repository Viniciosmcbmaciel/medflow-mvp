"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(
          "medflow_token"
        )
      : null;

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

type MedicationField =
  | "name"
  | "dosage"
  | "duration";

type Medication = {
  name: string;
  dosage: string;
  duration: string;
};

export default function PrescriptionModal({
  patient,
  onClose,
}: any) {
  const [doctorName, setDoctorName] =
    useState("");

  const [crm, setCrm] = useState("");

  const [medications, setMedications] =
    useState<Medication[]>([
      {
        name: "",
        dosage: "",
        duration: "",
      },
    ]);

  const [instructions, setInstructions] =
    useState("");

  function addMedication() {
    setMedications([
      ...medications,
      {
        name: "",
        dosage: "",
        duration: "",
      },
    ]);
  }

  function updateMedication(
    index: number,
    field: MedicationField,
    value: string
  ) {
    const updated = [...medications];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setMedications(updated);
  }

  async function generatePDF() {
    try {
      const res = await fetch(
        `${API_URL}/prescription-pdf`,
        {
          method: "POST",

          headers: getAuthHeaders(),

          body: JSON.stringify({
            patientName:
              patient.fullName,

            doctorName,

            crm,

            medications,

            instructions,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Erro ao gerar PDF"
        );
      }

      const blob = await res.blob();

      const url =
        window.URL.createObjectURL(blob);

      window.open(url);
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao gerar prescrição"
      );
    }
  }

  return (
    <div className="modal-overlay">
      <div className="medical-modal">
        <div className="medical-header">
          <div>
            <h2>
              Prescrição Eletrônica
            </h2>

            <p>
              Paciente:{" "}
              {patient.fullName}
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 220px",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <input
            className="input"
            placeholder="Nome do médico"
            value={doctorName}
            onChange={(e) =>
              setDoctorName(
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="CRM"
            value={crm}
            onChange={(e) =>
              setCrm(e.target.value)
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {medications.map(
            (med, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.4fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <input
                  className="input"
                  placeholder="Medicamento"
                  value={med.name}
                  onChange={(e) =>
                    updateMedication(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  className="input"
                  placeholder="Posologia"
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(
                      index,
                      "dosage",
                      e.target.value
                    )
                  }
                />

                <input
                  className="input"
                  placeholder="Duração"
                  value={med.duration}
                  onChange={(e) =>
                    updateMedication(
                      index,
                      "duration",
                      e.target.value
                    )
                  }
                />
              </div>
            )
          )}
        </div>

        <button
          className="button button-secondary"
          style={{
            marginTop: 18,
          }}
          onClick={addMedication}
        >
          + Adicionar medicamento
        </button>

        <div
          style={{
            marginTop: 20,
          }}
        >
          <textarea
            className="textarea"
            placeholder="Orientações médicas"
            value={instructions}
            onChange={(e) =>
              setInstructions(
                e.target.value
              )
            }
          />
        </div>

        <div
          className="medical-actions"
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
          }}
        >
          <button
            className="button button-primary"
            onClick={generatePDF}
          >
            📄 Gerar PDF
          </button>

          <button
            className="button button-secondary"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}