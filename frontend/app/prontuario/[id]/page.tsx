"use client";

import { useState } from "react";

const patients = [
  "João Silva",
  "Maria Souza",
  "Carlos Lima",
];

export default function ProntuariosPage() {
  const [search, setSearch] =
    useState("");

  const filtered = patients.filter(
    (p) =>
      p
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <div className="main-content">
      <div className="card">
        <h1>Prontuários</h1>

        <input
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            marginTop: 20,
            marginBottom: 20,
            height: 50,
            borderRadius: 12,
            border:
              "1px solid #cbd5e1",
            padding: "0 16px",
          }}
        />

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {filtered.map((patient) => (
            <div
              key={patient}
              style={{
                padding: 18,
                border:
                  "1px solid #e2e8f0",
                borderRadius: 14,
                background: "white",
              }}
            >
              <strong>
                {patient}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}