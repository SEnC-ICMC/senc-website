"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    checkSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

return (
    // FIX 1: Added bg-black/50 to ensure the background always stays dark enough for legibility
    <nav className="relative bg-black/60 bg-gradient-to-r from-[#07D46A]/20 via-[#7634CA]/20 to-[#0015E2]/20 backdrop-blur-3xl border-b border-white/10 px-6 py-4 sticky top-0 z-50">
      
      {/* Camada da Textura (Background Pattern) */}
      <div className="absolute inset-0 z-[-1] opacity-10 bg-[url('/waves.webp')] bg-repeat pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-black text-2xl text-white tracking-tight">
          <img src="/logo-senc.webp" alt="Logo SEnC" className="w-10 h-10 object-contain" />
          <div>
            SEnC<span className="text-[#07D46A]">.2026</span>
          </div>
        </Link>

        {/* ========================================= */}
        {/* DESKTOP MENU: Hidden on mobile (hidden md:flex) */}
        {/* ========================================= */}
        <div className="hidden md:flex items-center gap-6">
          {/* FIX 2: Changed text-gray-200 to text-gray-50 and added drop-shadow-md for better contrast */}
          <Link href="/#hero" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Home
          </Link>

          <Link href="/#countdown" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Sobre
          </Link>

          <Link href="/schedule" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Programação
          </Link>

          <Link href="/#sponsors" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link href="/#contact" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Contato
          </Link>

          {!isLoading && (
            <Link
              href={isLoggedIn ? "/participant" : "/participant/new-registration"}
              className="bg-green-400 hover:bg-green-300 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg hover:shadow-green-400/20"
            >
              Área do Participante
            </Link>
          )}
        </div>

        {/* ========================================= */}
        {/* MOBILE BUTTON: Hidden on PCs (md:hidden) */}
        {/* ========================================= */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-50 hover:text-green-400 focus:outline-none transition"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            // The "X" Close Icon
            <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // The Hamburger Icon
            <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ========================================= */}
      {/* MOBILE DROPDOWN: Shows only if button is clicked */}
      {/* ========================================= */}
      {isMobileMenuOpen && (
        // FIX 3: Added bg-black/60 to the mobile menu to ensure it blocks out light backgrounds when opened
        <div className="md:hidden px-4 sm:px-6 pt-4 pb-4 flex flex-col gap-4 border-t border-white/10 mt-4 rounded-b-xl animate-in slide-in-from-top-2">
          <Link
            href="/#hero"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Home
          </Link>

          <Link
            href="/#countdown"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Sobre
          </Link>

          <Link
            href="/schedule"
            onClick={() => setIsMobileMenuOpen(false)} 
            className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Programação
          </Link>

          <Link
            href="/#sponsors"
            onClick={() => setIsMobileMenuOpen(false)} 
            className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Contato
          </Link>

          {!isLoading && (
            <Link
              href={isLoggedIn ? "/participant" : "/participant/new-registration"}
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full text-center bg-green-400 hover:bg-green-300 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              Área do Participante
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}