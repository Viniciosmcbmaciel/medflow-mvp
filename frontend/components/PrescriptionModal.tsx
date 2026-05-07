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
      <div className="modal-content">
        <h2>
          Prescrição Eletrônica
        </h2>

        <input
          placeholder="Nome do médico"
          value={doctorName}
          onChange={(e) =>
            setDoctorName(
              e.target.value
            )
          }
        />

        <input
          placeholder="CRM"
          value={crm}
          onChange={(e) =>
            setCrm(e.target.value)
          }
        />

        {medications.map(
          (med, index) => (
            <div
              key={index}
              style={{
                marginTop: 20,
              }}
            >
              <input
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
          onClick={addMedication}
        >
          + Medicamento
        </button>

        <textarea
          placeholder="Orientações"
          value={instructions}
          onChange={(e) =>
            setInstructions(
              e.target.value
            )
          }
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            onClick={generatePDF}
          >
            📄 Gerar PDF
          </button>

          <button onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}