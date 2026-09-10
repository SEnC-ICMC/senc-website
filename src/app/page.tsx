import Image from "next/image";
import Link from "next/link";
import ContactForm from '../components/ContactForm';

// 1. SPLIT YOUR MOCK DATA INTO TWO ARRAYS
const realizadores = [
  '/sponsors/usp.png',
  '/sponsors/icmc.png',
  '/sponsors/eesc.png',
];

const patrocinadores = [  
  { logo: '/sponsors/controlID.png', url: 'https://www.controlid.com.br' },
  { logo: '/sponsors/digitaly.png', url: 'https://digitaly.tech/' },  
  { logo: '/sponsors/FRconsultoria.png', url: 'https://www.consultoriafr.com.br/' },
  { logo: '/sponsors/lwart.png', url: 'https://www.lwart.com.br/' },
  { logo: '/sponsors/motorola.png', url: 'https://www.motorola.com.br' },
  { logo: '/sponsors/opus.png', url: 'https://www.opus-software.com.br/' },
  { logo: '/sponsors/phelcom.png', url: 'https://phelcom.com/pt-br/' }
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
        
        {/* Imagem de Fundo */}
        <Image 
          src="/foto-senc-25-bg.jpg" 
          alt="University Tech Fair Scene"
          fill
          className="object-cover"
          quality={80}
          priority 
        />

        {/* Camada de Desfoque (Mais escura para destacar o texto branco) */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-10"></div>

        {/* Conteúdo Central */}
        <div className="relative z-20 max-w-5xl px-4 flex flex-col items-center text-white drop-shadow-2xl -mt-24">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight tracking-tighter">
            <span className="text-[#07D46A]">X</span> Semana da <br className="hidden md:block" /> Engenharia de Computação
          </h1>
          
          <p className="mt-8 text-lg md:text-2xl font-medium tracking-widest bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full">
            21 a 25 de Setembro de 2026
          </p>
          
          <Link 
            href="/participant/new-registration" 
            className="mt-12 bg-[#07D46A] text-[#0D1713] px-12 py-4 rounded-full text-xl font-bold uppercase shadow-lg transition-all duration-300 hover:bg-green-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(7,212,106,0.5)]"
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
      <section id="countdown" className="w-full bg-white text-brand-dark py-24 flex flex-col items-center px-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-2">#SAVETHEDATE</h2>
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

        {/* The Countdown Display */}
        <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
          
          {/* Reuseable Card Component Mapping */}
          {[
            { label: 'Dia', value: '04' },
            { label: 'Hora', value: '07' },
            { label: 'Minuto', value: '05' },
            { label: 'Segundo', value: '39' },
          ].map((item) => (
            <div key={item.label} className="w-32 md:w-40 flex flex-col items-center text-center">
              {/* The "Shaded Rectangle" Card */}
              <div className="bg-white w-full h-32 md:h-40 flex items-center justify-center rounded-xl shadow-xl border border-gray-100">
                <span className="text-6xl md:text-7xl font-black text-gray-950 font-mono tracking-tighter">
                  {item.value}
                </span>
              </div>
              <span className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
          
        </div>
      </section>

      {/* 
        ========================================================================
        4. SPONSORS & PARTNERS HUB
        Now split into Realização (Infrastructure) and Patrocínio (Financial)
        ======================================================================== 
      */}
      <section id="sponsors" className="w-full bg-gray-100 py-32 flex flex-col items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-2">Parcerias 2026</h2>
        <p className="text-gray-700 max-w-xl text-center mb-16 px-6">
          Conheça as instituições e empresas que tornam a X SEnC possível.
        </p>

        {/* --- BLOCK 1: PATROCINADORES --- */}
        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-8">Patrocínio</h3>
        
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
                className="object-contain p-8 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </a>
          ))}
        </div>

        {/* --- BLOCK 2: REALIZADORES --- */}
        <h3 className="text-xl font-black text-gray-600 uppercase tracking-widest mb-8">Realização</h3>
        
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
                // O padding (p-5) veio para cá
                className="object-contain p-5 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

      </section>

      {/* 
        ========================================================================
        5. CONTACT US SECTION (The Hybrid Dashboard)
        Blueprint Ref: image_0.png & image_2.png (Contact Page Visualization)
        Tailwind Key: grid md:grid-cols-[1fr,2fr], bg-brand-light, dark grey text
        ======================================================================== 
      */}
      <section id="contact" className="w-full bg-[#0D1713] text-white py-32 flex flex-col items-center relative overflow-hidden">
        
        {/* Efeito de brilho de fundo (Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#07D46A] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-5xl font-black uppercase mb-16 z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#07D46A] to-white">
          Contato
        </h2>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr,2fr] gap-12 w-full z-10">
          
          {/* Coluna A: Informações de Contato (Estilo Glassmorphism Escuro) */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 text-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-white">Informações de Contato</h3>
            <p className="text-gray-400 mb-8">Estamos prontos para tirar suas dúvidas e receber sugestões.</p>
            
            <ul className="space-y-6">
              <li className="flex flex-col">
                <span className="text-[#07D46A] font-bold uppercase tracking-wider text-sm mb-1">Endereço</span>
                <span className="leading-relaxed">Av. Trab. São Carlense, 400<br/>Parque Arnold Schimidt<br/>São Carlos - SP 13566-590</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[#07D46A] font-bold uppercase tracking-wider text-sm mb-1">Email</span>
                <a href="mailto:senc@icmc.usp.br" className="hover:text-white transition-colors">senc@icmc.usp.br</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[#07D46A] font-bold uppercase tracking-wider text-sm mb-1">Facebook</span>
                <a href="https://facebook.com/senc.usp" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">facebook.com/senc.usp</a>
              </li>
            </ul>
          </div>

          {/* Coluna B: O Formulário Interativo */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#07D46A]/20">
            <ContactForm /> 
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        6. FOOTER 
        ======================================================================== 
      */}
      <footer className="w-full bg-[#080d0a] py-8 border-t border-white/5 text-center flex flex-col items-center">
        <p className="text-gray-500 text-sm">
          © 2026 X Semana da Engenharia de Computação. Todos os direitos reservados.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Desenvolvido em São Carlos, SP.
        </p>
      </footer>
    </main>
  );
}
