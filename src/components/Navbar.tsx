// src/components/Navbar.tsx
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

  useEffect(() => {
    // 1. Check the initial session when the Navbar loads
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    checkSession();

    // 2. Listen for login/logout events so the button updates instantly
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    // ========================================================================
    // THE STICKY HEADER
    // Visual Style: Dark background, pinned to top, floats above content
    // Tailwind Key: sticky top-0 z-50, shadow-lg, backdrop-blur-sm
    // ========================================================================
    <nav className="sticky top-0 z-50 w-full bg-brand-dark/95 backdrop-blur-sm text-white py-4 shadow-lg border-b border-gray-800">
      
      {/* Centered Content Container */}
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* The Logo / Brand Name */}
        <Link href="/" className="font-black text-2xl text-white-900 tracking-tight">
        SEnC<span className="text-green-600"> 2026</span>
      </Link>

        {/* ========================================================================
            THE BEAUTIFUL BUTTONS (HASH-LINKS)
            Visual Style: Minimalist text, green accents, bold CTA button
            Functional: Jump to specific #id sections on the page
            ======================================================================== */}
        <div className="flex gap-4 md:gap-8 items-center">
          
          <Link href="/#hero" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Home
          </Link>
          
          <Link href="/#countdown" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Sobre
          </Link>
          
          {/* THE NEW AGENDA ROUTE */}
          <Link href="/schedule" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Programação
          </Link>
          
          <Link href="/#sponsors" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link href="/#contact" className="font-medium text-gray-200 hover:text-green-400 transition duration-200">
            Contato
          </Link>

          {/* Prominent CTA 'Button' */}
          {/* Dynamic Participant Area Button */}
        {!isLoading && (
          <Link 
            href={isLoggedIn ? "/participant" : "/participant/new-registration"}
            className="bg-green-900 hover:bg-green-800 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg"
          >
            Área do Participante
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
}