"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // 🔥 fechar com ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const filtered = patients.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={overlay}
          onClick={onClose} // 🔥 clicar fora fecha
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div style={header}>
              <div>
                <h2 style={{ margin: 0 }}>Nova Consulta</h2>
                <span style={{ color: "#64748b", fontSize: 14 }}>
                  {dateLabel}
                </span>
              </div>

              <button onClick={onClose} style={closeBtn}>
                ✕
              </button>
            </div>

            {/* BUSCA */}
            <input
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={input}
            />

            {/* LISTA */}
            <div style={list}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p.id)}
                  style={{
                    ...item,
                    background:
                      selectedPatient === p.id ? "#dbeafe" : "transparent",
                  }}
                >
                  {p.fullName}
                </div>
              ))}
            </div>

            {/* MÉDICO */}
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

            {/* ACTIONS */}
            <div style={actions}>
              <button onClick={onClose} style={btnCancel}>
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
                style={btnConfirm}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 🎨 ESTILO PREMIUM */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(15,23,42,0.6)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  width: 420,
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const list = {
  maxHeight: 140,
  overflowY: "auto" as const,
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  marginTop: 8,
};

const item = {
  padding: 10,
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 16,
};

const btnCancel = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#e2e8f0",
  cursor: "pointer",
};

const btnConfirm = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};