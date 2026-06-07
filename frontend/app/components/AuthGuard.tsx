"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "../utils/auth";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      logout();
    }
  }, []);

  return <>{children}</>;
}