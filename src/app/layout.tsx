import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Semana da Engenharia de Computacao",
  description: "Evento organizado por alunos para conectar alunos e o mundo da computacao dentro e fora da universidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-light text-gray-900`}>
        <Navbar /> {/* <-- Add your component here */}
        <main className="min-h-screen">
          {children} {/* This is where page.tsx gets injected */}
        </main>
      </body>
    </html>
  );
}