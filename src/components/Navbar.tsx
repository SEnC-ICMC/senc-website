import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    // FIX 1: Added bg-black/50 to ensure the background always stays dark enough for legibility
    <nav className="relative sticky top-0 z-50 border-b border-[#07D46A]/25 bg-gradient-to-r from-[#071711] via-[#0d241e] to-[#111631] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] md:border-white/10 md:bg-black/60 md:px-6 md:py-4 md:shadow-none md:backdrop-blur-3xl">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white md:gap-3 md:text-2xl">
          <Image src="/logo-senc.webp" alt="Logo SEnC" width={40} height={40} className="h-9 w-9 object-contain md:h-10 md:w-10" />
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