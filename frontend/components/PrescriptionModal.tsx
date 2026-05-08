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
      <div
        className="modal-content"
        style={{
          background: "#ffffff",
          width: "90%",
          maxWidth: 700,
          padding: 24,
          borderRadius: 20,
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
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
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 10,
            border:
              "1px solid #d1d5db",
          }}
        />

        <input
          placeholder="CRM"
          value={crm}
          onChange={(e) =>
            setCrm(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            borderRadius: 10,
            border:
              "1px solid #d1d5db",
          }}
        />

        {medications.map(
          (med, index) => (
            <div
              key={index}
              style={{
                marginBottom: 20,
                display: "grid",
                gap: 10,
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
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border:
                    "1px solid #d1d5db",
                }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border:
                    "1px solid #d1d5db",
                }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border:
                    "1px solid #d1d5db",
                }}
              />
            </div>
          )
        )}

        <button
          onClick={addMedication}
          style={{
            padding:
              "10px 16px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            marginBottom: 20,
          }}
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
          style={{
            width: "100%",
            minHeight: 120,
            padding: 12,
            borderRadius: 10,
            border:
              "1px solid #d1d5db",
          }}
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
            style={{
              padding:
                "12px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background:
                "#2563eb",
              color: "#fff",
            }}
          >
            📄 Gerar PDF
          </button>

          <button
            onClick={onClose}
            style={{
              padding:
                "12px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}