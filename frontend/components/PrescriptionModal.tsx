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
        {/* HEADER */}
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

        {/* MÉDICO */}
        <div className="medical-grid">
          <div>
            <label className="label">
              Médico
            </label>

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
          </div>

          <div>
            <label className="label">
              CRM
            </label>

            <input
              className="input"
              placeholder="CRM"
              value={crm}
              onChange={(e) =>
                setCrm(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* MEDICAMENTOS */}
        <div
          style={{
            marginTop: 24,
          }}
        >
          <h3
            style={{
              marginBottom: 16,
            }}
          >
            Medicamentos
          </h3>

          {medications.map(
            (med, index) => (
              <div
                key={index}
                className="medical-grid"
                style={{
                  marginBottom: 14,
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

          <button
            className="button button-secondary"
            onClick={addMedication}
          >
            + Adicionar medicamento
          </button>
        </div>

        {/* ORIENTAÇÕES */}
        <div
          style={{
            marginTop: 24,
          }}
        >
          <label className="label">
            Orientações
          </label>

          <textarea
            className="textarea"
            placeholder="Digite as orientações médicas..."
            value={instructions}
            onChange={(e) =>
              setInstructions(
                e.target.value
              )
            }
          />
        </div>

        {/* BOTÕES */}
        <div className="medical-actions">
          <button
            className="button button-secondary"
            onClick={onClose}
          >
            Fechar
          </button>

          <button
            className="button button-green"
            onClick={generatePDF}
          >
            📄 Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
}