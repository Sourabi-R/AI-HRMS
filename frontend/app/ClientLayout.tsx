"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages WITHOUT sidebar
  const hideSidebar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}