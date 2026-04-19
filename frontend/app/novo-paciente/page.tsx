"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("medflow_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function NovoPacientePage() {
  const { ready } = useRequireAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullName,
          cpf: cpf || null,
          birthDate: birthDate || null,
          phone: phone || null,
          email: email || null,
          address: address || null,
          allergies: allergies || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar paciente");
      }

      alert("Paciente cadastrado com sucesso");
      router.push("/pacientes");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao cadastrar paciente");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Novo Paciente</h1>
        <p className="page-subtitle">
          Cadastre um novo paciente no sistema.
        </p>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="field">
            <label className="label">Nome completo</label>
            <input
              type="text"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">CPF</label>
            <input
              type="text"
              className="input"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Data de nascimento</label>
            <input
              type="date"
              className="input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Telefone</label>
            <input
              type="text"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Endereço</label>
            <input
              type="text"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Alergias</label>
            <textarea
              className="textarea"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <button type="submit" className="button button-primary">
            {loading ? "Salvando..." : "Cadastrar Paciente"}
          </button>
        </form>
      </main>
    </>
  );
}