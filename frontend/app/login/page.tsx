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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6fbf8",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          border: "1px solid #dcfce7",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 6px 18px rgba(22, 101, 52, 0.08)",
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#166534",
            marginBottom: 8,
          }}
        >
          MedFlow
        </h1>

        <p style={{ color: "#4b5563", marginBottom: 24 }}>
          Faça login para acessar o sistema.
        </p>

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
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