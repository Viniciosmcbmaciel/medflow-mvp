"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Fraca", className: "strength-weak" };
    if (score <= 3) return { label: "Média", className: "strength-medium" };
    return { label: "Forte", className: "strength-strong" };
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao redefinir senha.");
      }

      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="auth-shell-simple">
        <section className="auth-card-premium">
          <div className="auth-logo-pill">MedFlow</div>
          <h1 className="auth-heading">Link inválido</h1>
          <p className="auth-muted">
            O link de redefinição está inválido ou expirou.
          </p>
          <Link href="/esqueci-senha" className="button button-primary auth-full-button">
            Solicitar novo link
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell-simple">
      <section className="auth-card-premium">
        <div className="auth-logo-pill">MedFlow</div>

        <h1 className="auth-heading">Criar nova senha</h1>
        <p className="auth-muted">
          Escolha uma senha segura para continuar acessando sua conta.
        </p>

        <form onSubmit={handleSubmit} className="auth-stack">
          <div className="field">
            <label className="label">Nova senha</label>
            <input
              type="password"
              className="input"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {password && (
            <div className="password-strength">
              <div className={`strength-bar ${strength.className}`} />
              <span>Segurança: {strength.label}</span>
            </div>
          )}

          <div className="field">
            <label className="label">Confirmar senha</label>
            <input
              type="password"
              className="input"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary auth-full-button"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        <Link href="/login" className="auth-back-link">
          Voltar para o login
        </Link>
      </section>
    </main>
  );
}