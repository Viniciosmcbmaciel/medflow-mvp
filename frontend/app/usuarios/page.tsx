"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import { useRequireAuth } from "../../lib/auth";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEDICO" | "SECRETARIA";
  crm?: string | null;
  specialty?: string | null;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("medflow_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function UsuariosPage() {
  const { ready } = useRequireAuth(true);

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("MEDICO");
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function loadUsers() {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao carregar usuários");
      }

      setUsers(data);
    } catch (error: any) {
      alert(error.message || "Erro ao carregar usuários");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          crm,
          specialty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar usuário");
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("MEDICO");
      setCrm("");
      setSpecialty("");

      await loadUsers();
      alert("Usuário criado com sucesso");
    } catch (error: any) {
      alert(error.message || "Erro ao criar usuário");
    }
  }

  useEffect(() => {
    if (ready) {
      loadUsers();
    }
  }, [ready]);

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Usuários do Sistema</h1>
        <p className="page-subtitle">
          Somente administradores podem cadastrar médicos e secretárias.
        </p>

        <form onSubmit={handleSubmit} className="form-card">
          <h2 className="section-title">Novo usuário</h2>

          <div className="field">
            <label className="label">Nome</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Senha</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Perfil</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value as User["role"])}
            >
              <option value="MEDICO">Médico</option>
              <option value="SECRETARIA">Secretária</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {role === "MEDICO" && (
            <>
              <div className="field">
                <label className="label">CRM</label>
                <input
                  className="input"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label">Especialidade</label>
                <input
                  className="input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="button button-primary">
            Cadastrar usuário
          </button>
        </form>

        <section className="form-card">
          <h2 className="section-title">Usuários cadastrados</h2>

          <div className="list">
            {users.map((user) => (
              <div key={user.id} className="item-card">
                <div className="item-title">{user.name}</div>
                <div className="item-text">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="item-text">
                  <strong>Perfil:</strong> {user.role}
                </div>

                {user.role === "MEDICO" && (
                  <>
                    <div className="item-text">
                      <strong>CRM:</strong> {user.crm || "—"}
                    </div>
                    <div className="item-text">
                      <strong>Especialidade:</strong> {user.specialty || "—"}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}