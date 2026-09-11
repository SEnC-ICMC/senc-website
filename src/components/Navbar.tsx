import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    // FIX 1: Added bg-black/50 to ensure the background always stays dark enough for legibility
    <nav className="relative bg-black/60 bg-gradient-to-r from-[#07D46A]/20 via-[#7634CA]/20 to-[#0015E2]/20 backdrop-blur-3xl border-b border-white/10 px-6 py-4 sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-black text-2xl text-white tracking-tight">
          <Image src="/logo-senc.webp" alt="Logo SEnC" width={40} height={40} className="w-10 h-10 object-contain" />
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

          <Link
            href="/participant/new-registration"
            className="bg-green-400 hover:bg-green-300 text-black font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg hover:shadow-green-400/20"
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