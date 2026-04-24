"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUser, getToken } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      localStorage.setItem("medflow_token", data.token);
      localStorage.setItem("medflow_user", JSON.stringify(data.user));

      router.push("/");
    } catch (error: any) {
      alert(error.message);
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
        background: "linear-gradient(135deg, #ecfdf5, #eff6ff)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>MedFlow</h1>

        <p style={{ color: "#64748b", marginBottom: 24 }}>
          Acesse sua conta
        </p>

        <form onSubmit={handleLogin}>
          <input
            className="input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="input"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginTop: 12 }}
          />

          <button
            type="submit"
            className="button button-primary"
            style={{ width: "100%", marginTop: 16 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/esqueci-senha" style={{ color: "#2563eb" }}>
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </main>
  );
}