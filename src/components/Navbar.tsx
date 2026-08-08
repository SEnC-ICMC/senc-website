// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
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
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-white hover:text-green-400 transition-colors">
          SEnC 2026
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
          <Link 
            href="/participant/new-registration" 
            className="bg-green-500 text-brand-dark px-6 py-2.5 rounded-full font-extrabold uppercase text-sm tracking-wide shadow-md transition hover:scale-105 hover:bg-green-600"
          >
            Área do Participante
          </Link>
        </div>
      </div>
    </nav>
  );
}