"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  patient: any;
  onClose: () => void;
};

export default function MedicalRecordModal({
  patient,
  onClose,
}: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function getHeaders() {
    const token = localStorage.getItem("medflow_token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function loadRecords() {
    try {
      const res = await fetch(
        `${API_URL}/medical-records/${patient.id}`,
        {
          headers: getHeaders(),
        }
      );

      const data = await res.json();

      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveRecord() {
    if (!notes.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/medical-records`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: "TEMP_DOCTOR_ID",
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar prontuário");
      }

      setNotes("");

      await loadRecords();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar prontuário");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="medical-modal">

        <div className="medical-header">
          <div>
            <h2>Prontuário Eletrônico</h2>

            <p>{patient.fullName}</p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="medical-records">
          {records.length === 0 && (
            <div className="empty-state">
              Nenhuma evolução registrada
            </div>
          )}

          {records.map((record) => (
            <div
              key={record.id}
              className="medical-record-card"
            >
              <div className="medical-record-date">
                {new Date(record.createdAt).toLocaleString("pt-BR")}
              </div>

              <div className="medical-record-text">
                {record.notes}
              </div>
            </div>
          ))}
        </div>

        <textarea
          className="textarea"
          placeholder="Digite evolução clínica..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="medical-actions">
          <button
            className="button button-primary"
            onClick={saveRecord}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar evolução"}
          </button>
        </div>

      </div>
    </div>
  );
}