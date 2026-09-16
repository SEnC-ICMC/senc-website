"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#hero", label: "Home" },
  { href: "/#countdown", label: "Sobre" },
  { href: "/#sponsors", label: "Patrocinadores" },
  { href: "/#contact", label: "Contato" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-lg border border-white/15 bg-white/[0.06] p-2 text-gray-50 transition hover:border-brand-green/60 hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/50"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-3 right-3 top-[calc(100%+0.75rem)] flex flex-col gap-2 rounded-2xl border border-brand-green/30 bg-gradient-to-br from-black via-[#071d14] to-[#080d22] px-3 pb-4 pt-3 shadow-[0_18px_45px_rgba(0,0,0,0.45)] md:hidden">
          <div className="h-1 w-16 self-center rounded-full bg-gradient-to-r from-brand-green via-brand-purple-deep to-brand-blue opacity-90" />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-transparent px-4 py-3 font-medium text-gray-50 drop-shadow-md transition duration-200 hover:border-white/10 hover:bg-white/10 hover:text-brand-green"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/schedule"
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-brand-green/50 bg-brand-green px-4 py-3 text-center font-bold text-brand-black shadow-[0_0_18px_rgba(7,212,106,0.18)] transition hover:bg-green-300"
          >
            Programação
          </Link>
          <Link
            href="/participant/new-registration"
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full rounded-xl bg-brand-green px-5 py-3 text-center text-sm font-bold text-brand-black shadow-[0_8px_24px_rgba(7,212,106,0.22)] transition-all hover:bg-green-400"
          >
            Área do Participante
          </Link>
        </div>
      )}
    </div>
  );
}
