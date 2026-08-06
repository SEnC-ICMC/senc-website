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
  '/sponsors/motorola.svg', // Replace with your actual paths
  '/sponsors/phelcom.svg',
  '/sponsors/opus.png',
  '/sponsors/lwart.png',
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
      <section id="hero" className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* The Actual Image (public/hero-fair.jpg) */}
        <Image 
          src="/foto-senc-25-bg.jpg" // Placeholder image
          alt="University Tech Fair Scene"
          fill
          className="object-cover"
          quality={80}
          priority // Prioritize loading this image for better performance
        />

        {/* The Blurring Overlay Layer */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

        {/* The Content (Over the blur) */}
        <div className="relative z-20 max-w-4xl px-4 flex flex-col items-center text-white drop-shadow-lg">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-tight">
            X Semana da Engenharia de Computação
          </h1>
          <p className="mt-6 text-xl md:text-2xl font-semibold tracking-wide bg-brand-primary px-6 py-2 rounded-full">
            21 a 25 de Setembro de 2026
          </p>
          <Link 
            href="/participant/new-registration" 
            className="mt-12 bg-green-500 text-brand-dark px-10 py-4 rounded-md text-2xl font-bold uppercase transition hover:scale-105 hover:bg-green-600 shadow-xl"
          >
            INSCREVA-SE
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

        {/* --- BLOCK 1: PATROCINADORES (Moved to Top & Made Larger) --- */}
        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-8">Patrocínio</h3>
        
        {/* Larger gap, larger boxes for premium sponsors */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-16 items-center mb-24">
          {patrocinadores.map((logoPath, index) => (
            <div 
              key={`patrocinador-${index}`} 
              // INCREASED SIZE: w-72 h-48 (288px by 192px) with p-8 padding
              className="w-64 h-40 flex items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 transition hover:shadow-2xl hover:-translate-y-1 duration-300"
            >
              <img 
                src={logoPath} 
                alt={`Patrocinador ${index + 1}`} 
                className="w-full h-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* --- BLOCK 2: REALIZADORES (Moved to Bottom & Made Smaller) --- */}
        <h3 className="text-xl font-black text-gray-600 uppercase tracking-widest mb-8">Realização</h3>
        
        {/* Smaller gap, smaller boxes for institutional partners */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 items-center">
          {realizadores.map((logoPath, index) => (
            <div 
              key={`realizador-${index}`} 
              // DECREASED SIZE: w-56 h-36 (224px by 144px) with p-5 padding
              className="w-56 h-36 flex items-center justify-center p-5 bg-white rounded-xl shadow-md border border-gray-100 transition hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <img 
                src={logoPath} 
                alt={`Realização ${index + 1}`} 
                className="w-full h-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
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
      <section id="contact" className="w-full bg-brand-light text-gray-900 py-32 flex flex-col items-center">
        <h2 className="text-5xl font-black uppercase mb-16">Contato</h2>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr,2fr] gap-12 w-full">
          
          {/* Column A: Direct Contact Details (Server Component Data) */}
          <div className="bg-gray-100 p-8 rounded-lg shadow border border-gray-200 text-brand-dark">
            <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
            <p className="text-gray-700 mb-6">Estamos prontos para tirar suas dúvidas e receber sugestões.</p>
            
            <ul className="space-y-4">
              <li><strong>Endereço:</strong> <br/>Av. Trab. São Carlense, 400<br/>Parque Arnold Schimidt<br/>São Carlos - SP 13566-590</li>
              <li><strong>Email:</strong> <br/><a href="mailto:senc@icmc.usp.br" className="text-green-600 font-medium hover:underline">senc@icmc.usp.br</a></li>
              <li><strong>Facebook:</strong> <br/><a href="https://facebook.com/senc.usp" target="_blank" rel="noreferrer" className="text-blue-700 font-medium hover:underline">facebook.com/senc.usp</a></li>
            </ul>
          </div>

          {/* Column B: The Interactive Form (Client Component Injection) */}
          <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
            {/* INJECTING THE CLIENT FORM HERE */}
            <ContactForm /> 
          </div>

        </div>
      </section>

      {/* Dummy background content so you can see the white background end */}
      <div className="w-full bg-gray-50 py-32 text-center text-gray-400">
        Introductory Section Placeholder
      </div>
    </main>
  );
}