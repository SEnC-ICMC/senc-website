"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#hero", label: "Home" },
  { href: "/#countdown", label: "Sobre" },
  { href: "/schedule", label: "Programação" },
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
        className="p-2 text-gray-50 hover:text-green-400 focus:outline-none transition"
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
        <div className="absolute left-0 right-0 top-full flex flex-col gap-4 border-t border-white/10 bg-black/90 px-4 pb-4 pt-4 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/participant/new-registration"
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-green-400 hover:bg-green-300 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all"
          >
            Área do Participante
          </Link>
        </div>
      )}
    </div>
  );
}
