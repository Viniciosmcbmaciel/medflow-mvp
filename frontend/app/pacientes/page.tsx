"use client";

import {
  useEffect,
  useState,
} from "react";

type Patient = {
  id: string;

  fullName: string;

  cpf: string;

  phone: string;

  insurance: string;

  birthDate: string;
};

const API =
  "https://medflow-mvp-production.up.railway.app";

export default function PatientsPage() {
  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      fullName: "",
      cpf: "",
      birthDate: "",
      phone: "",
      insurance: "",
      email: "",
    });

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await fetch(
        `${API}/patients`
      );

      const data =
        await response.json();

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createPatient() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/patients`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message
        );

        return;
      }

      alert(
        "Paciente cadastrado!"
      );

      setForm({
        fullName: "",
        cpf: "",
        birthDate: "",
        phone: "",
        insurance: "",
        email: "",
      });

      loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao cadastrar paciente"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">
          MedFlow
        </h1>
      </aside>

      <main className="main-content">
        <div className="card">
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              marginBottom: 30,
            }}
          >
            Pacientes
          </h1>

          {/* FORM */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <input
              className="modal-input"
              placeholder="Nome completo"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName:
                    e.target.value,
                })
              }
            />

            <input
              className="modal-input"
              placeholder="CPF"
              value={form.cpf}
              onChange={(e) =>
                setForm({
                  ...form,
                  cpf:
                    e.target.value,
                })
              }
            />

            <input
              type="date"
              className="modal-input"
              value={form.birthDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  birthDate:
                    e.target.value,
                })
              }
            />

            <input
              className="modal-input"
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone:
                    e.target.value,
                })
              }
            />

            <input
              className="modal-input"
              placeholder="Convênio"
              value={form.insurance}
              onChange={(e) =>
                setForm({
                  ...form,
                  insurance:
                    e.target.value,
                })
              }
            />

            <input
              className="modal-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            className="primary-button"
            onClick={
              createPatient
            }
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : "Cadastrar Paciente"}
          </button>

          {/* LISTA */}
          <div
            style={{
              marginTop: 40,
              display: "grid",
              gap: 16,
            }}
          >
            {patients.map(
              (patient) => (
                <div
                  key={patient.id}
                  style={{
                    background:
                      "white",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 20,
                  }}
                >
                  <h2
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    {
                      patient.fullName
                    }
                  </h2>

                  <p>
                    CPF:{" "}
                    {
                      patient.cpf
                    }
                  </p>

                  <p>
                    Telefone:{" "}
                    {
                      patient.phone
                    }
                  </p>

                  <p>
                    Convênio:{" "}
                    {
                      patient.insurance
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}