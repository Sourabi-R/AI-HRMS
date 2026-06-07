import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "AI HRMS",
  description: "AI Powered Human Resource Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f1f5f9",
        }}
      >
        {/* ALL LOGIC HANDLED INSIDE CLIENT LAYOUT */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
