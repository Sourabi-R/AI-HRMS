"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, logout } from "../utils/auth";

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();

    if (!role || !allowedRoles.includes(role)) {
      logout();
    }
  }, []);

  return <>{children}</>;
}