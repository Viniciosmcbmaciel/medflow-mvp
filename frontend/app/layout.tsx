import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedFlow",
  description: "Sistema de Prontuário Eletrônico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
