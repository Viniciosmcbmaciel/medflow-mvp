"use client";

import Link from "next/link";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao solicitar redefinição.");
      }

      setSent(true);
    } catch (error: any) {
      alert(error.message || "Erro ao solicitar redefinição.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell-simple">
      <section className="auth-card-premium">
        <div className="auth-logo-pill">MedFlow</div>

        {!sent ? (
          <>
            <h1 className="auth-heading">Recuperar senha</h1>
            <p className="auth-muted">
              Informe seu e-mail cadastrado. Enviaremos um link seguro para
              você redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="auth-stack">
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

              <button
                type="submit"
                className="button button-primary auth-full-button"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success-box">
            <div className="auth-success-icon">✓</div>
            <h1 className="auth-heading">Verifique seu e-mail</h1>
            <p className="auth-muted">
              Se o e-mail informado estiver cadastrado, você receberá um link
              para redefinir sua senha em instantes.
            </p>
          </div>
        )}

        <Link href="/login" className="auth-back-link">
          Voltar para o login
        </Link>
      </section>
    </main>
  );
}