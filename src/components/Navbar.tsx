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
    <nav className="sticky top-0 z-50 w-full bg-brand-dark/95 backdrop-blur-sm text-white py-4 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="font-black text-2xl text-white-900 tracking-tight">
          SEnC<span className="text-green-600"> 2026</span>
        </Link>
        
        {/* ========================================= */}
        {/* DESKTOP MENU: Hidden on mobile (hidden md:flex) */}
        {/* ========================================= */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#hero" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Home
          </Link>
          
          <Link href="/#countdown" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Sobre
          </Link>
          
          <Link href="/schedule" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Programação
          </Link>
          
          <Link href="/#sponsors" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link href="/#contact" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Contato
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participant" : "/participant/new-registration"}
              className="bg-green-900 hover:bg-green-800 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg"
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
            href="/#hero" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Home
          </Link>
          
          <Link 
            href="/#countdown" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Sobre
          </Link>
          
          <Link 
            href="/schedule" 
            onClick={() => setIsMobileMenuOpen(false)} // Closes menu when clicked
            className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Programação
          </Link>
          
          <Link 
            href="/#sponsors" 
            onClick={() => setIsMobileMenuOpen(false)} // Closes menu when clicked
            className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link 
            href="/#contact" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Contato
          </Link>
          
          {!isLoading && (
            <Link 
              href={isLoggedIn ? "/participant" : "/participant/new-registration"}
              onClick={() => setIsMobileMenuOpen(false)} // Closes menu when clicked
              className="bg-green-900 hover:bg-green-800 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              Área do Participante
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}