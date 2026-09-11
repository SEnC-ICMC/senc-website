import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "X Semana da Engenharia de Computação | SEnC USP",
    template: "%s | SEnC USP",
  },
  description:
    "A Semana da Engenharia de Computação da USP de São Carlos conecta estudantes, pesquisadores e o mercado de tecnologia.",
  keywords: [
    "SEnC",
    "Semana da Engenharia de Computação",
    "Engenharia de Computação",
    "USP São Carlos",
    "eventos de tecnologia",
  ],
  authors: [{ name: "SEnC USP São Carlos" }],
  creator: "SEnC USP São Carlos",
  publisher: "SEnC USP São Carlos",
  applicationName: "SEnC USP",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "SEnC USP São Carlos",
    title: "X Semana da Engenharia de Computação | SEnC USP",
    description:
      "Participe da Semana da Engenharia de Computação da USP de São Carlos.",
    images: [
      {
        url: "/logo-senc.webp",
        alt: "Logo da Semana da Engenharia de Computação",
      },
    ],
  },
  icons: {
    icon: "/logo-senc.webp",
    apple: "/logo-senc.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-brand-light text-gray-900 overflow-x-hidden`}>
        <Navbar /> {/* <-- Add your component here */}
        <main className="min-h-screen">
          {children} {/* This is where page.tsx gets injected */}
        </main>
      </body>
    </html>
  );
}