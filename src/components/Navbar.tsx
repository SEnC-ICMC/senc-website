import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <nav className="relative sticky top-0 z-50 border-b border-brand-green/25 bg-gradient-to-r from-black via-[#071711] to-[#080d22] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:border-brand-green/20 md:px-6 md:py-4 md:shadow-[0_8px_24px_rgba(0,0,0,0.24)] md:backdrop-blur-3xl">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white md:gap-3 md:text-2xl">
          <Image src="/logo-senc.webp" alt="Logo SEnC" width={40} height={40} className="h-9 w-9 object-contain md:h-10 md:w-10" />
          <div>
            SEnC<span className="text-brand-green"> 2026</span>
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

          <Link href="/#sponsors" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Patrocinadores
          </Link>

          <Link href="/#contact" className="font-medium text-gray-50 drop-shadow-md hover:text-green-400 transition duration-200">
            Contato
          </Link>

          <Link
            href="/schedule"
            className="rounded-full border border-brand-green/70 bg-brand-green px-5 py-2.5 text-sm font-bold text-brand-black shadow-[0_0_18px_rgba(7,212,106,0.2)] transition hover:bg-green-300 hover:shadow-[0_0_24px_rgba(7,212,106,0.35)]"
          >
            Programação
          </Link>

          <Link
            href="/participant/new-registration"
            className="bg-brand-green hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg hover:shadow-brand-green/20"
          >
            Área do Participante
          </Link>
        </div>

        {/* ========================================= */}
        {/* MOBILE BUTTON: Hidden on PCs (md:hidden) */}
        {/* ========================================= */}
        <MobileMenu />
      </div>

      {/* ========================================= */}
      {/* MOBILE DROPDOWN: Shows only if button is clicked */}
      {/* ========================================= */}
    </nav>
  );
}