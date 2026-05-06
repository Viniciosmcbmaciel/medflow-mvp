"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MedicalEvolutionModal({
  patient,
  onClose,
}: any) {
  const [evolutions, setEvolutions] = useState([]);

  const [form, setForm] = useState({
    chiefComplaint: "",
    diagnosis: "",
    conduct: "",
    observations: "",
    cid: "",

    bloodPressure: "",
    weight: "",
    height: "",
    temperature: "",
  });

  function getHeaders() {
    const token = localStorage.getItem("medflow_token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function load() {
    const res = await fetch(
      `${API_URL}/medical-evolutions/${patient.id}`,
      {
        headers: getHeaders(),
      }
    );

    setEvolutions(await res.json());
  }

  async function save() {
    await fetch(`${API_URL}/medical-evolutions`, {
      method: "POST",

      headers: getHeaders(),

      body: JSON.stringify({
        patientId: patient.id,

        doctorId: "TEMP_DOCTOR",

        ...form,
      }),
    });

    setForm({
      chiefComplaint: "",
      diagnosis: "",
      conduct: "",
      observations: "",
      cid: "",

      bloodPressure: "",
      weight: "",
      height: "",
      temperature: "",
    });

    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="medical-evolution-modal">

        <div className="medical-evolution-header">
          <div>
            <h2>Prontuário Clínico</h2>

            <p>{patient.fullName}</p>
          </div>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="medical-grid">

          <input
            placeholder="CID"
            value={form.cid}
            onChange={(e) =>
              setForm({
                ...form,
                cid: e.target.value,
              })
            }
          />

          <input
            placeholder="PA"
            value={form.bloodPressure}
            onChange={(e) =>
              setForm({
                ...form,
                bloodPressure: e.target.value,
              })
            }
          />

          <input
            placeholder="Peso"
            value={form.weight}
            onChange={(e) =>
              setForm({
                ...form,
                weight: e.target.value,
              })
            }
          />

          <input
            placeholder="Altura"
            value={form.height}
            onChange={(e) =>
              setForm({
                ...form,
                height: e.target.value,
              })
            }
          />

        </div>

        <textarea
          placeholder="Queixa principal"
          value={form.chiefComplaint}
          onChange={(e) =>
            setForm({
              ...form,
              chiefComplaint: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Diagnóstico"
          value={form.diagnosis}
          onChange={(e) =>
            setForm({
              ...form,
              diagnosis: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Conduta"
          value={form.conduct}
          onChange={(e) =>
            setForm({
              ...form,
              conduct: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Observações"
          value={form.observations}
          onChange={(e) =>
            setForm({
              ...form,
              observations: e.target.value,
            })
          }
        />

        <button
          className="button button-primary"
          onClick={save}
        >
          Salvar evolução
        </button>

        <div className="timeline">
          {evolutions.map((evo: any) => (
            <div
              key={evo.id}
              className="timeline-card"
            >
              <div className="timeline-date">
                {new Date(
                  evo.createdAt
                ).toLocaleString("pt-BR")}
              </div>

              <h4>{evo.chiefComplaint}</h4>

              <p>
                <strong>Diagnóstico:</strong>{" "}
                {evo.diagnosis}
              </p>

              <p>
                <strong>Conduta:</strong>{" "}
                {evo.conduct}
              </p>

              <p>
                <strong>CID:</strong>{" "}
                {evo.cid}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}