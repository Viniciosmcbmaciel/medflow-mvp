"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@medflow.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("medflow_remember_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
      router.replace("/");
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Erro ao fazer login");
      }

      const token = data.token || data.accessToken;
      const user = data.user;

      if (!token) {
        throw new Error("Token não retornado pelo login");
      }

      if (!user) {
        throw new Error("Usuário não retornado pelo login");
      }

      localStorage.setItem("medflow_token", token);
      localStorage.setItem("medflow_user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("medflow_remember_email", email);
      } else {
        localStorage.removeItem("medflow_remember_email");
      }

      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-badge">Sistema clínico inteligente</div>

          <h1 className="auth-title">MedFlow</h1>

          <p className="auth-description">
            Plataforma SaaS para gestão de pacientes, agenda, prontuários,
            prescrições e exames em um ambiente moderno e seguro.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <strong>Prontuário digital</strong>
              <span>Histórico clínico organizado e acessível.</span>
            </div>

            <div className="auth-feature-card">
              <strong>Agenda profissional</strong>
              <span>Controle semanal com status das consultas.</span>
            </div>

            <div className="auth-feature-card">
              <strong>Gestão completa</strong>
              <span>Fluxo para médicos, secretárias e administradores.</span>
            </div>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="auth-illustration-card auth-illustration-card-1">
            <span className="illustration-label">Consultas hoje</span>
            <strong>24</strong>
          </div>

          <div className="auth-illustration-card auth-illustration-card-2">
            <span className="illustration-label">Pacientes</span>
            <strong>Organizados</strong>
          </div>

          <div className="auth-illustration-card auth-illustration-card-3">
            <span className="illustration-label">Fluxo clínico</span>
            <strong>Mais rápido</strong>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <div className="auth-logo-pill">MedFlow</div>
            <h2>Acessar conta</h2>
            <p>Entre para continuar gerenciando sua clínica.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="field">
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">Senha</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 88 }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "#eef2f7",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontWeight: 800,
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginTop: 2,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar e-mail
              </label>

              <Link
                href="/esqueci-senha"
                style={{
                  color: "#2563eb",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              className="button button-primary auth-submit-button"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span className="login-spinner" />
                  Entrando...
                </span>
              ) : (
                "Entrar no sistema"
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <span>MedFlow • Gestão clínica moderna</span>
          </div>
        </div>
      </section>
    </main>
  );
}