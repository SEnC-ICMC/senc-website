"use client"; // CRITICAL: This allows useState and form logic in Next.js App Router

import { useState } from "react";

// Typescript definition for the form state
type FormData = {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
};

// Typescript definition for validation errors
type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function ContactForm() {
  // Input State Management
  const [formData, setFormData] = useState<FormData>({ nome: '', email: '', telefone: '', mensagem: '' });
  
  // Validation Error State
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Submission Status State (idle, submitting, success, error)
  const [status, setStatus] = useState<string>('idle');

  // Unified input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error message on typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Form Submission Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({}); // Reset previous errors

    // 1. Validate based on Portuguese roadmap requirements (Zod placeholder logic)
    const newErrors: FormErrors = {};
    if (!formData.nome) newErrors.nome = "Insira seu nome completo!";
    if (!formData.email) {
      newErrors.email = "Insira um e-mail!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Insira um e-mail válido!";
    }
    if (!formData.telefone) newErrors.telefone = "Insira número para contato!";
    if (!formData.mensagem) newErrors.mensagem = "Insira sua mensagem!";

    // 2. If errors exist, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('idle');
      return;
    }

    // 3. TODO: Submit to your custom Node.js/PostgreSQL backend API (Prisma logic will go here)
    console.log("Submitting:", formData);
    
    // Simulate API call success/failure
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful submission (marketing success/green pop-up)
    setStatus('success');
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* NOME COMPLETO */}
      <div>
        <label htmlFor="nome" className="block text-bg font-semibold text-gray-500">Nome Completo</label>
        <input 
          type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-lg border ${errors.nome ? 'border-red-500' : 'border-white/10'} bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:border-[#07D46A] focus:ring-1 focus:ring-[#07D46A] transition-colors`}
        />
        {errors.nome && <p className="mt-1 text-bg text-red-400 font-bold uppercase tracking-tight">{errors.nome}</p>}
      </div>

      {/* EMAIL */}
      <div>
        <label htmlFor="email" className="block text-bg font-semibold text-gray-500">Email</label>
        <input 
          type="email" id="email" name="email" value={formData.email} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-white/10'} bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:border-[#07D46A] focus:ring-1 focus:ring-[#07D46A] transition-colors`}
        />
        {errors.email && <p className="mt-1 text-bg text-red-400 font-bold uppercase tracking-tight">{errors.email}</p>}
      </div>

      {/* TELEFONE */}
      <div>
        <label htmlFor="telefone" className="block text-bg font-semibold text-gray-500">Telefone para Contato</label>
        <input 
          type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-lg border ${errors.telefone ? 'border-red-500' : 'border-white/10'} bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:border-[#07D46A] focus:ring-1 focus:ring-[#07D46A] transition-colors`}
        />
        {errors.telefone && <p className="mt-1 text-bg text-red-400 font-bold uppercase tracking-tight">{errors.telefone}</p>}
      </div>

      {/* MENSAGEM */}
      <div>
        <label htmlFor="mensagem" className="block text-bg font-semibold text-gray-500">Sua Mensagem</label>
        <textarea 
          id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} rows={5}
          className={`mt-1 block w-full p-3 rounded-lg border ${errors.mensagem ? 'border-red-500' : 'border-white/10'} bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:border-[#07D46A] focus:ring-1 focus:ring-[#07D46A] transition-colors`}
        />
        {errors.mensagem && <p className="mt-1 text-bg text-red-400 font-bold uppercase tracking-tight">{errors.mensagem}</p>}
      </div>

      {/* SUBMIT BUTTON */}
      <div>
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-[#07D46A] text-[#0D1713] px-6 py-3 rounded-xl font-bold uppercase shadow-lg transition-all duration-300 hover:bg-green-500 hover:scale-[1.02] disabled:bg-gray-600 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </div>

      {/* Global Status Display */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-900/30 border border-[#07D46A]/50 text-[#07D46A] rounded-lg font-semibold text-center">
          ✅ Mensagem enviada com sucesso!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg font-semibold text-center">
          ❌ Tente novamente! (Falha no envio)
        </div>
      )}
    </form>
  );
}