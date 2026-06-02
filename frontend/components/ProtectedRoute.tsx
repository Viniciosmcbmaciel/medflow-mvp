"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { permissions } from "../lib/permissions";

type UserRole =
  | "ADMIN"
  | "MEDICO"
  | "SECRETARIA"
  | "RECEPCAO";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser =
      localStorage.getItem("medflow_user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user: User =
      JSON.parse(storedUser);

    const allowedRoutes =
      permissions[user.role] || [];

    const hasPermission =
      allowedRoutes.some((route) =>
        pathname.startsWith(route)
      );

    if (!hasPermission) {
      router.push("/agenda");
    }
  }, [pathname, router]);

  return <>{children}</>;
}