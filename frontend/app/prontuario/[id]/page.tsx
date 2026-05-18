"use client";

import { useState } from "react";

export default function ProntuarioPage() {
  const [activeTab, setActiveTab] =
    useState("evolucao");

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
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "320px 1fr",
            gap: 24,
          }}
        >
          {/* PACIENTE */}
          <div className="card">
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 999,
                  background:
                    "#22c55e",
                  margin:
                    "0 auto 18px",
                }}
              />

              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                João Silva
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginTop: 8,
                }}
              >
                CPF:
                000.000.000-00
              </p>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Convênio:
                Unimed
              </p>
            </div>

            <div
              style={{
                marginTop: 30,
                display: "grid",
                gap: 10,
              }}
            >
              <button
                className={
                  activeTab ===
                  "evolucao"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() =>
                  setActiveTab(
                    "evolucao"
                  )
                }
              >
                Evolução
              </button>

              <button
                className={
                  activeTab ===
                  "anamnese"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() =>
                  setActiveTab(
                    "anamnese"
                  )
                }
              >
                Anamnese
              </button>

              <button
                className={
                  activeTab ===
                  "prescricao"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() =>
                  setActiveTab(
                    "prescricao"
                  )
                }
              >
                Prescrições
              </button>

              <button
                className={
                  activeTab ===
                  "exames"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() =>
                  setActiveTab(
                    "exames"
                  )
                }
              >
                Exames
              </button>

              <button
                className={
                  activeTab ===
                  "historico"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() =>
                  setActiveTab(
                    "historico"
                  )
                }
              >
                Histórico
              </button>
            </div>
          </div>

          {/* CONTEUDO */}
          <div className="card">
            {activeTab ===
              "evolucao" && (
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 24,
                  }}
                >
                  Evolução Médica
                </h1>

                <textarea
                  className="modal-input"
                  placeholder="Digite a evolução clínica do paciente..."
                  style={{
                    minHeight: 240,
                    resize: "vertical",
                  }}
                />

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent:
                      "flex-end",
                  }}
                >
                  <button className="primary-button">
                    Salvar Evolução
                  </button>
                </div>
              </div>
            )}

            {activeTab ===
              "anamnese" && (
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 24,
                  }}
                >
                  Anamnese
                </h1>

                <textarea
                  className="modal-input"
                  placeholder="História clínica, sintomas, alergias, doenças..."
                  style={{
                    minHeight: 240,
                  }}
                />
              </div>
            )}

            {activeTab ===
              "prescricao" && (
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 24,
                  }}
                >
                  Prescrições
                </h1>

                <div className="evolution-history-card">
                  <strong>
                    Dipirona 1g
                  </strong>

                  <p>
                    Tomar 1 comprimido
                    de 6/6h
                  </p>
                </div>
              </div>
            )}

            {activeTab ===
              "exames" && (
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 24,
                  }}
                >
                  Exames
                </h1>

                <button className="primary-button">
                  Solicitar Exame
                </button>
              </div>
            )}

            {activeTab ===
              "historico" && (
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 24,
                  }}
                >
                  Histórico Clínico
                </h1>

                <div className="evolution-history">
                  <div className="evolution-history-card">
                    <div className="evolution-history-date">
                      18/05/2026
                    </div>

                    <div className="evolution-history-text">
                      Paciente com
                      melhora clínica.
                    </div>
                  </div>

                  <div className="evolution-history-card">
                    <div className="evolution-history-date">
                      10/05/2026
                    </div>

                    <div className="evolution-history-text">
                      Início do quadro
                      gripal.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}