import Image from "next/image";
import Link from "next/link";
import ContactForm from '../components/ContactForm';
import ScrollReveal from '../components/ScrollReveal';
import CountdownTimer from '../components/CountdownTimer';

// 1. SPLIT YOUR MOCK DATA INTO TWO ARRAYS
const realizadores = [
  '/sponsors/usp.png',
  '/sponsors/icmc.png',
  '/sponsors/eesc.png',
];

const patrocinadores = [  
  { logo: '/sponsors/controlID.webp', url: 'https://www.controlid.com.br' },
  { logo: '/sponsors/digitaly.webp', url: 'https://digitaly.tech/' },  
  { logo: '/sponsors/FRconsultoria.webp', url: 'https://www.consultoriafr.com.br/' },
  { logo: '/sponsors/lwart.webp', url: 'https://www.lwart.com.br/' },
  { logo: '/sponsors/motorola.webp', url: 'https://www.motorola.com.br' },
  { logo: '/sponsors/opus.webp', url: 'https://www.opus-software.com.br/' },
  { logo: '/sponsors/phelcom.webp', url: 'https://phelcom.com/pt-br/' }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50">

      {/*
        ========================================================================
        1. THE HERO SECTION (app/page.tsx)
        Visual Style: Blurred Background with Text/Dates/Button Overlay
        Tailwind Key: relative, backdrop-blur, text-shadow-md
        ========================================================================
      */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* The photo is loaded only on desktop; mobile uses the lightweight CSS artwork. */}
        <div className="hero-backdrop" aria-hidden="true" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-black/40 to-black/60 md:bg-black/50 md:bg-none md:backdrop-blur-md"></div>

        {/* Conteúdo Central */}
        <div className="relative z-20 max-w-5xl px-4 flex flex-col items-center text-white drop-shadow-2xl -mt-24">
          
          <h1 className="font-display text-5xl font-bold uppercase leading-tight tracking-wide md:text-7xl lg:text-8xl">
            <span className="text-brand-green">X</span> Semana da <br className="hidden md:block" /> <span className="marker-highlight">Engenharia</span> de Computação
          </h1>
          
          <p className="font-display mt-8 rounded-full border border-brand-green bg-black/35 px-8 py-3 text-lg font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_18px_rgba(7,212,106,0.18)] md:px-12 md:text-2xl">
            21 a 25 de Setembro de 2026
          </p>
          
          <Link 
            href="/participant/new-registration" 
            className="mt-12 bg-brand-green text-brand-black px-12 py-4 rounded-full text-xl font-bold uppercase shadow-lg transition-all duration-300 hover:bg-green-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(7,212,106,0.5)]"
          >
            Inscreva-se
          </Link>
        </div>
        
      </section>

      {/*
        ========================================================================
        2. THE COUNTDOWN SECTION (app/page.tsx)
        Visual Style: Four Shaded Rectangular Cards on White Background
        Tailwind Key: bg-white, shadow-xl, text-shadow-xl (for deep shading)
        ========================================================================
      */}
      <section id="countdown" className="relative w-full bg-white text-brand-dark py-24 flex flex-col items-center px-6 overflow-hidden">
        {/* Soft ambient color blobs, kept subtle so the section stays light */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />

        <ScrollReveal className="relative z-10 flex flex-col items-center w-full">
          <h2 className="text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-2">
            #SAVETHEDATE
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
            CONTE CADA SEGUNDO <br className="hidden md:inline"/>PARA A X SENC
          </h3>

          {/* The Introduction Paragraph */}
          <div className="max-w-3xl text-center mb-16">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
              Prepare-se para uma jornada emocionante na Semana Acadêmica de Engenharia de Computação 2026!
              Trazemos palestras inspiradoras com líderes do mercado, workshops práticos, bate-papos exclusivos
              e eventos recreativos. Uma semana feita sob medida para conectar você com as tendências reais
              da tecnologia e do mercado de trabalho.
            </p>
          </div>

          {/* The Countdown Display — now a real, live-ticking timer */}
          <CountdownTimer />
        </ScrollReveal>
      </section>

      {/*
        ========================================================================
        4. SPONSORS & PARTNERS HUB
        Now split into Realização (Infrastructure) and Patrocínio (Financial)
        ========================================================================
      */}
      <section id="sponsors" className="w-full bg-gray-100 py-32 flex flex-col items-center">
        <ScrollReveal className="flex flex-col items-center">
          <h2 className="text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-2">
            Parcerias 2026
          </h2>
          <p className="text-gray-700 max-w-xl text-center mb-16 px-6">
            Conheça as instituições e empresas que tornam a X SEnC possível.
          </p>
        </ScrollReveal>

        {/* --- BLOCK 1: PATROCINADORES --- */}
        <ScrollReveal>
          <h3 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-8">Patrocínio</h3>
        </ScrollReveal>

        <ScrollReveal>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-16 items-center mb-24">
          {patrocinadores.map((patrocinador, index) => (
            <a 
              key={`patrocinador-${index}`} 
              href={patrocinador.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="relative block w-64 h-40 bg-white rounded-xl shadow-lg border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 duration-300 overflow-hidden"
            >
              <Image 
                src={patrocinador.logo} 
                alt={`Patrocinador ${index + 1}`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-8 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </a>
          ))}
        </div>
        </ScrollReveal>
        <ScrollReveal>
          <h3 className="text-xl font-black text-gray-600 uppercase tracking-widest mb-8">Realização</h3>
        </ScrollReveal>
        <ScrollReveal>
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 items-center">
            {realizadores.map((logoPath, index) => (
              <div 
                key={`realizador-${index}`} 
                // Adicionamos 'relative' e removemos 'flex/items-center/p-5'
                className="relative w-56 h-36 bg-white rounded-xl shadow-md border border-gray-100 transition hover:shadow-xl hover:-translate-y-1 duration-300 overflow-hidden"
              >
                <Image 
                  src={logoPath} 
                  alt={`Realização ${index + 1}`} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  // O padding (p-5) veio para cá
                  className="object-contain p-5 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

      </section>

      {/*
        ========================================================================
        5. CONTACT US SECTION (The Hybrid Dashboard)
        Blueprint Ref: image_0.png & image_2.png (Contact Page Visualization)
        Tailwind Key: grid md:grid-cols-[1fr,2fr], bg-brand-light, dark grey text
        ========================================================================
      */}
      <section id="contact" className="w-full bg-brand-light text-gray-900 py-32 flex flex-col items-center">
        <ScrollReveal>
          <h2 className="text-5xl font-black uppercase mb-16 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Contato</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr,2fr] gap-12 w-full">

            {/* Column A: Direct Contact Details (Server Component Data) */}
            <div className="bg-gray-100 p-8 rounded-lg shadow border border-gray-200 text-brand-dark">
              <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
              <p className="text-gray-700 mb-6">Estamos prontos para tirar suas dúvidas e receber sugestões.</p>

              <ul className="space-y-5">
                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  <div>
                    <strong className="block text-sm text-gray-500 uppercase tracking-wide mb-0.5">Endereço</strong>
                    Av. Trab. São Carlense, 400<br/>Parque Arnold Schimidt<br/>São Carlos - SP 13566-590
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18c.414 0 .75.336.75.75v10.5a.75.75 0 01-.75.75h-18a.75.75 0 01-.75-.75V6.75z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l9.75 6.75 9.75-6.75" />
                    </svg>
                  </span>
                  <div>
                    <strong className="block text-sm text-gray-500 uppercase tracking-wide mb-0.5">Email</strong>
                    <a href="mailto:senc@icmc.usp.br" className="text-green-600 font-medium hover:underline">senc@icmc.usp.br</a>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                    IG
                  </span>
                  <div>
                    <strong className="block text-sm text-gray-500 uppercase tracking-wide mb-0.5">Instagram</strong>
                    <a href="https://instagram.com/senc.usp" target="_blank" rel="noreferrer" className="text-pink-500 font-medium hover:underline">instagram.com/senc.usp</a>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    in
                  </span>
                  <div>
                    <strong className="block text-sm text-gray-500 uppercase tracking-wide mb-0.5">LinkedIn</strong>
                    <a href="https://linkedin.com/company/senc" target="_blank" rel="noreferrer" className="text-blue-500 font-medium hover:underline">linkedin.com/company/senc</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column B: The Interactive Form (Client Component Injection) */}
            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
              {/* INJECTING THE CLIENT FORM HERE */}
              <ContactForm />
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 
        ========================================================================
        6. FOOTER 
        ======================================================================== 
      */}
      <footer className="w-full bg-[#080d0a] py-8 border-t border-white/5 text-center flex flex-col items-center">
        <p className="text-gray-500 text-sm">
          © 2026 X Semana da Engenharia de Computação.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Desenvolvido em São Carlos, SP.
        </p>
      </footer>
    </main>
  );
}
