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

      const response = await fetch(
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

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Erro ao fazer login"
        );

        return;
      }

      localStorage.setItem(
        "medflow_token",
        data.token
      );

      localStorage.setItem(
        "medflow_user",
        JSON.stringify(data.user)
      );

      router.push("/agenda");
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao conectar com servidor"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form
        onSubmit={handleLogin}
        className="login-card"
      >
        <h1>Entrar no sistema</h1>

        <p>
          Faça login para acessar
          o painel médico.
        </p>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>
      </form>
    </div>
  );
}