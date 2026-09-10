"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    <nav className="relative bg-gradient-to-r from-[#07D46A]/20 via-[#7634CA]/20 to-[#0015E2]/20 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
      
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
          <Link href="/programacao" className="font-medium text-[#9EAEA5] hover:text-white transition-colors">
            Programação
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participante" : "/participante/nova-inscricao"}
              className="bg-white text-[#0D1713] font-medium text-sm px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:bg-[#9E6CDF] hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(158,108,223,0.4)]"
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
          className="md:hidden p-2 text-[#9EAEA5] hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            // The "X" Close Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // The Hamburger Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ========================================= */}
      {/* MOBILE DROPDOWN: Shows only if button is clicked */}
      {/* ========================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2 flex flex-col gap-4 border-t border-[#1A2E25] mt-4 animate-in slide-in-from-top-2">
          
          <Link 
            href="/programacao" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-[#9EAEA5] hover:text-white transition-colors block px-2 py-2"
          >
            Programação
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participante" : "/participante/nova-inscricao"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-white text-center hover:bg-gray-200 text-[#0D1713] font-medium text-sm px-5 py-3 rounded-xl shadow-md transition-all"
            >
              Área do Participante
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}