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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="font-black text-2xl text-gray-900 tracking-tight">
          SEnC<span className="text-blue-600">.2026</span>
        </Link>
        
        {/* ========================================= */}
        {/* DESKTOP MENU: Hidden on mobile (hidden md:flex) */}
        {/* ========================================= */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/programacao" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Programação
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participante" : "/participante/nova-inscricao"}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg"
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
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
        <div className="md:hidden pt-4 pb-2 flex flex-col gap-4 border-t border-gray-100 mt-4 animate-in slide-in-from-top-2">
          
          <Link 
            href="/programacao" 
            onClick={() => setIsMobileMenuOpen(false)} // Closes menu when clicked
            className="font-medium text-gray-600 hover:text-gray-900 transition-colors block px-2 py-2"
          >
            Programação
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participante" : "/participante/nova-inscricao"}
              onClick={() => setIsMobileMenuOpen(false)} // Closes menu when clicked
              className="bg-gray-900 text-center hover:bg-gray-800 text-white font-medium text-sm px-5 py-3 rounded-xl shadow-md transition-all"
            >
              Área do Participante
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}