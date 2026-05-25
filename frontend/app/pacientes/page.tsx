"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type Patient = {
  id: string;

  fullName: string;

  cpf?: string;

  birthDate?: string;

  phone?: string;

  insurance?: string;

  email?: string;
};

export default function PacientesPage() {
  const router = useRouter();

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [filteredPatients, setFilteredPatients] =
    useState<Patient[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     NOVO PACIENTE
  ========================================= */

  const [fullName, setFullName] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [insurance, setInsurance] =
    useState("");

  const [email, setEmail] =
    useState("");

  /* =========================================
     EDITAR PACIENTE
  ========================================= */

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState<Patient | null>(
    null
  );

  const [
    openEditModal,
    setOpenEditModal,
  ] = useState(false);

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/patients"
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setPatients(data);

      setFilteredPatients(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================================
     SEARCH
  ========================================= */

  function handleSearch(
    value: string
  ) {
    setSearch(value);

    if (!value) {
      setFilteredPatients(
        patients
      );

      return;
    }

    const filtered =
      patients.filter((patient) =>
        patient.fullName
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )
      );

    setFilteredPatients(filtered);
  }

  /* =========================================
     CREATE PATIENT
  ========================================= */

  async function createPatient() {
    try {
      setLoading(true);

      const response = await fetch(
        "https://medflow-mvp-production.up.railway.app/api/patients",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName,

            cpf,

            birthDate,

            phone,

            insurance,

            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Erro ao cadastrar paciente"
        );
      }

      alert(
        "Paciente cadastrado com sucesso!"
      );

      setFullName("");
      setCpf("");
      setBirthDate("");
      setPhone("");
      setInsurance("");
      setEmail("");

      await loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao cadastrar paciente"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     UPDATE PATIENT
  ========================================= */

  async function updatePatient() {
    if (!selectedPatient) return;

    try {
      setLoading(true);

      const response = await fetch(
        `https://medflow-mvp-production.up.railway.app/api/patients/${selectedPatient.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            selectedPatient
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao atualizar paciente"
        );
      }

      alert(
        "Paciente atualizado com sucesso!"
      );

      setOpenEditModal(false);

      await loadPatients();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao atualizar paciente"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     NAVIGATION
  ========================================= */

  function openMedicalRecord(
    patient: Patient
  ) {
    localStorage.setItem(
      "selected_patient",
      JSON.stringify(patient)
    );

    router.push(
      "/prontuarios"
    );
  }

  function openSchedule(
    patient: Patient
  ) {
    localStorage.setItem(
      "selected_patient",
      JSON.stringify(patient)
    );

    router.push("/agenda");
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="sidebar-title">
          MedFlow
        </h1>

        <nav className="sidebar-menu">
          <a href="/agenda">
            Agenda
          </a>

          <a href="/pacientes">
            Pacientes
          </a>

          <a href="/prontuarios">
            Prontuários
          </a>

          <a href="/prescricoes">
            Prescrições
          </a>

          <a href="/historico">
            Histórico
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* HEADER */}
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            Pacientes
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 8,
            }}
          >
            Cadastro e gestão
            hospitalar de pacientes.
          </p>
        </div>

        {/* CADASTRO */}
        <div className="card">
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            Novo Paciente
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: 18,
            }}
          >
            <input
              className="modal-input"
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="CPF"
              value={cpf}
              onChange={(e) =>
                setCpf(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              className="modal-input"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="Telefone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="Convênio"
              value={insurance}
              onChange={(e) =>
                setInsurance(
                  e.target.value
                )
              }
            />

            <input
              className="modal-input"
              placeholder="E-mail"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <button
            className="primary-button"
            style={{
              marginTop: 24,
            }}
            onClick={
              createPatient
            }
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : "Cadastrar Paciente"}
          </button>
        </div>

        {/* LISTA */}
        <div
          className="card"
          style={{
            marginTop: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {filteredPatients.map(
              (patient) => (
                <div
                  key={patient.id}
                  style={{
                    background:
                      "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 24,
                    padding: 24,
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        marginBottom: 10,
                      }}
                    >
                      {
                        patient.fullName
                      }
                    </h3>

                    <p>
                      CPF: {
                        patient.cpf
                      }
                    </p>

                    <p>
                      Telefone:{" "}
                      {
                        patient.phone
                      }
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <button
                      className="secondary-button"
                      onClick={() =>
                        openSchedule(
                          patient
                        )
                      }
                    >
                      📅 Agendar
                    </button>

                    <button
                      className="primary-button"
                      onClick={() =>
                        openMedicalRecord(
                          patient
                        )
                      }
                    >
                      📄 Prontuário
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() => {
                        setSelectedPatient(
                          patient
                        );

                        setOpenEditModal(
                          true
                        );
                      }}
                    >
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* MODAL EDITAR */}
        {openEditModal &&
          selectedPatient && (
            <div className="premium-modal-overlay">
              <div className="premium-modal">
                <h2
                  style={{
                    marginBottom: 24,
                  }}
                >
                  Editar Paciente
                </h2>

                <div
                  style={{
                    display: "grid",
                    gap: 16,
                  }}
                >
                  <input
                    className="modal-input"
                    value={
                      selectedPatient.fullName
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        fullName:
                          e.target
                            .value,
                      })
                    }
                  />

                  <input
                    className="modal-input"
                    value={
                      selectedPatient.cpf ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        cpf: e.target.value,
                      })
                    }
                  />

                  <input
                    className="modal-input"
                    value={
                      selectedPatient.phone ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        phone:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    className="modal-input"
                    value={
                      selectedPatient.insurance ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        insurance:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    className="modal-input"
                    value={
                      selectedPatient.email ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedPatient({
                        ...selectedPatient,
                        email:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 24,
                  }}
                >
                  <button
                    className="primary-button"
                    onClick={
                      updatePatient
                    }
                  >
                    💾 Salvar
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setOpenEditModal(
                        false
                      )
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}