"use client";

import { useState } from "react";

type Patient = {
  id: string;
  fullName: string;
};

type Doctor = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    patientId: string;
    doctorId: string;
  }) => void;
  patients: Patient[];
  doctors: Doctor[];
  dateLabel: string;
};

export default function AppointmentModal({
  open,
  onClose,
  onSave,
  patients,
  doctors,
  dateLabel,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [doctorId, setDoctorId] = useState("");

  if (!open) return null;

  const filtered = patients.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Nova Consulta</h2>
        <p style={{ color: "#64748b" }}>{dateLabel}</p>

        {/* 🔍 BUSCA PACIENTE */}
        <input
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <div style={list}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPatient(p.id)}
              style={{
                padding: 8,
                borderRadius: 6,
                background:
                  selectedPatient === p.id ? "#dbeafe" : "transparent",
                cursor: "pointer",
              }}
            >
              {p.fullName}
            </div>
          ))}
        </div>

        {/* 👨‍⚕️ MÉDICO */}
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          style={input}
        >
          <option value="">Selecione o médico</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* 🔘 AÇÕES */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{ ...btn, background: "#e2e8f0" }}
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              if (!selectedPatient || !doctorId) {
                alert("Preencha todos os campos");
                return;
              }

              onSave({
                patientId: selectedPatient,
                doctorId,
              });

              onClose();
            }}
            style={{ ...btn, background: "#22c55e", color: "#fff" }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 estilos simples */
const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: 400,
  maxHeight: "80vh",
  overflow: "auto",
};

const input = {
  width: "100%",
  padding: 8,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const list = {
  maxHeight: 120,
  overflowY: "auto" as const,
  marginTop: 8,
  border: "1px solid #eee",
  borderRadius: 6,
};

const btn = {
  flex: 1,
  padding: 10,
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};