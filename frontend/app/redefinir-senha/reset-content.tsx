"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
        throw new Error(data.message);
      }

      alert("Senha redefinida com sucesso!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <div className="container">Token inválido</div>;
  }

  return (
    <main className="container">
      <h1>Nova senha</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="password"
          className="input"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="button button-primary">
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
    </main>
  );
}