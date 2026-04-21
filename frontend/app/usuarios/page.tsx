"use client";

import { Suspense, useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import { getStoredUser, useRequireAuth } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserRole = "ADMIN" | "MEDICO" | "RECEPCAO";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crm?: string | null;
  specialty?: string | null;
  createdAt?: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem("medflow_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "MEDICO":
      return "Médico";
    case "RECEPCAO":
      return "Secretaria";
    default:
      return role;
  }
}

function UsuariosPageContent() {
  const { ready } = useRequireAuth();
  const loggedUser = getStoredUser();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MEDICO");
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao carregar usuários");
      }

      setUsers(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        name,
        email,
        password,
        role,
        crm: role === "MEDICO" ? crm : undefined,
        specialty: role === "MEDICO" ? specialty : undefined,
      };

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao cadastrar usuário");
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("MEDICO");
      setCrm("");
      setSpecialty("");

      await loadUsers();
      alert("Usuário cadastrado com sucesso");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao cadastrar usuário");
    }
  }

  useEffect(() => {
    if (ready && loggedUser?.role === "ADMIN") {
      loadUsers();
    }
  }, [ready, loggedUser?.role]);

  if (!ready) {
    return <div className="container">Carregando...</div>;
  }

  if (loggedUser?.role !== "ADMIN") {
    return (
      <>
        <AppHeader />
        <main className="container">
          <div className="form-card">
            <h1 className="section-title">Acesso restrito</h1>
            <p className="page-subtitle">
              Somente administradores podem acessar o cadastro de usuários.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />

      <main className="container">
        <h1 className="page-title">Usuários do Sistema</h1>
        <p className="page-subtitle">
          Somente administradores podem cadastrar médicos e secretárias.
        </p>

        <form onSubmit={handleCreateUser} className="form-card">
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

          <div className="field">
            <label className="label">Perfil</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="MEDICO">Médico</option>
              <option value="RECEPCAO">Secretaria</option>
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

          {loading ? (
            <div className="empty-state">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">Nenhum usuário encontrado.</div>
          ) : (
            <div className="list">
              {users.map((user) => (
                <div key={user.id} className="item-card">
                  <div className="item-title">{user.name}</div>

                  <div className="item-text">
                    <strong>E-mail:</strong> {user.email}
                  </div>

                  <div className="item-text">
                    <strong>Perfil:</strong> {getRoleLabel(user.role)}
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

                  {user.createdAt && (
                    <div className="item-text">
                      <strong>Criado em:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default function UsuariosPage() {
  return (
    <Suspense fallback={<div className="container">Carregando...</div>}>
      <UsuariosPageContent />
    </Suspense>
  );
}