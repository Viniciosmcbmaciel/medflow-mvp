"use client";

const patients = [
  {
    id: 1,
    name: "João Silva",
  },
  {
    id: 2,
    name: "Maria Souza",
  },
];

export default function PacientesPage() {
  return (
    <div className="main-content">
      <div className="card">
        <h1>Pacientes</h1>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 16,
          }}
        >
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: 20,
                border:
                  "1px solid #e2e8f0",
                borderRadius: 16,
              }}
            >
              <strong>
                {patient.name}
              </strong>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <button className="primary-button">
                  Abrir prontuário
                </button>

                <button className="primary-button">
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}