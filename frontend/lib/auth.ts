"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEDICO" | "SECRETARIA";
  crm?: string | null;
  specialty?: string | null;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("medflow_token");
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("medflow_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("medflow_token");
  localStorage.removeItem("medflow_user");
}

export function useRequireAuth(adminOnly = false) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const token = getToken();
    const currentUser = getStoredUser();

    if (!token || !currentUser) {
      clearSession();
      router.replace("/login");
      return;
    }

    if (adminOnly && currentUser.role !== "ADMIN") {
      router.replace("/");
      return;
    }

    setUser(currentUser);
    setReady(true);
  }, [adminOnly, router]);

  return { ready, user };
}