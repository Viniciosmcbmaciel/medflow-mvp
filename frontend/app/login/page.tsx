"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@medflow.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
          <div className="auth-badge">Plataforma clínica inteligente</div>

          <h1 className="auth-title">
            MedFlow
          </h1>

          <p className="auth-description">
            Gestão moderna de pacientes, agenda, prescrições, exames e prontuários
            em uma experiência organizada, rápida e profissional.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <strong>Agenda inteligente</strong>
              <span>Controle semanal com visual claro e profissional.</span>
            </div>

            <div className="auth-feature-card">
              <strong>Prontuário digital</strong>
              <span>Evolução clínica, prescrição e exames em um só lugar.</span>
            </div>

            <div className="auth-feature-card">
              <strong>Operação eficiente</strong>
              <span>Fluxo ideal para médicos, secretárias e administradores.</span>
            </div>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="auth-illustration-card auth-illustration-card-1">
            <span className="illustration-label">Consultas</span>
            <strong>128 agendadas</strong>
          </div>

          <div className="auth-illustration-card auth-illustration-card-2">
            <span className="illustration-label">Pacientes</span>
            <strong>Base organizada</strong>
          </div>

          <div className="auth-illustration-card auth-illustration-card-3">
            <span className="illustration-label">Produtividade</span>
            <strong>Fluxo SaaS</strong>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Acessar sistema</h2>
            <p>Entre com seu usuário para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="field">
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">Senha</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="button button-primary auth-submit-button"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-form-footer">
            <span>MedFlow • Saúde com organização e tecnologia</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}