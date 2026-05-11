"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Login inválido"
        );
      }

      const data = await res.json();

      localStorage.setItem(
        "medflow_token",
        data.token
      );

      router.push("/");
    } catch (error) {
      console.error(error);

      alert("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      {/* LADO VERDE */}
      <div className="auth-brand-panel">
        <div>
          <div className="auth-badge">
            Plataforma clínica inteligente
          </div>

          <h1 className="auth-title">
            MedFlow
          </h1>

          <p className="auth-description">
            Gestão moderna de pacientes,
            agenda, prescrições,
            exames e prontuários em uma
            experiência organizada,
            rápida e profissional.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <strong>
                Agenda inteligente
              </strong>

              <span>
                Controle semanal com
                visual moderno e
                profissional.
              </span>
            </div>

            <div className="auth-feature-card">
              <strong>
                Prontuário digital
              </strong>

              <span>
                Evolução clínica,
                exames e prescrições.
              </span>
            </div>

            <div className="auth-feature-card">
              <strong>
                Fluxo SaaS médico
              </strong>

              <span>
                Estrutura moderna para
                clínicas e consultórios.
              </span>
            </div>
          </div>

          <div className="auth-illustration">
            <div className="auth-illustration-card auth-illustration-card-1">
              <span>
                Consultas
              </span>

              <strong>
                128 agendadas
              </strong>
            </div>

            <div className="auth-illustration-card auth-illustration-card-2">
              <span>
                Pacientes
              </span>

              <strong>
                Base organizada
              </strong>
            </div>

            <div className="auth-illustration-card auth-illustration-card-3">
              <span>
                Produtividade
              </span>

              <strong>
                Fluxo premium
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>
              Entrar no sistema
            </h2>

            <p>
              Faça login para acessar
              o painel médico.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
          >
            <input
              className="input"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="button-green"
              disabled={loading}
            >
              {loading
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}