// src/components/ContactForm.tsx
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
      
      {/* NOME COMPLETO (Blueprint Ref: Form State) */}
      <div>
        <label htmlFor="nome" className="block text-sm font-semibold text-gray-700">Nome Completo</label>
        <input 
          type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-md border ${errors.nome ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:ring-2 focus:ring-green-400/50 focus:border-green-400`}
        />
        {errors.nome && <p className="mt-1 text-sm text-red-500 font-bold uppercase tracking-tight">{errors.nome}</p>}
      </div>

      {/* EMAIL (Blueprint Ref: Form State with validation flow) */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
        <input 
          type="email" id="email" name="email" value={formData.email} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:ring-2 focus:ring-green-400/50 focus:border-green-400`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500 font-bold uppercase tracking-tight">{errors.email}</p>}
      </div>

      {/* TELEFONE (Blueprint Ref: Form State) */}
      <div>
        <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700">Telefone para Contato</label>
        <input 
          type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange}
          className={`mt-1 block w-full p-3 rounded-md border ${errors.telefone ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:ring-2 focus:ring-green-400/50 focus:border-green-400`}
        />
        {errors.telefone && <p className="mt-1 text-sm text-red-500 font-bold uppercase tracking-tight">{errors.telefone}</p>}
      </div>

      {/* MENSAGEM (Blueprint Ref: Form State) */}
      <div>
        <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700">Sua Mensagem</label>
        <textarea 
          id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} rows={5}
          className={`mt-1 block w-full p-3 rounded-md border ${errors.mensagem ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:ring-2 focus:ring-green-400/50 focus:border-green-400`}
        />
        {errors.mensagem && <p className="mt-1 text-sm text-red-500 font-bold uppercase tracking-tight">{errors.mensagem}</p>}
      </div>

      {/* SUBMIT BUTTON (Blueprint Ref: Call-to-Action) */}
      <div>
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-green-500 text-brand-dark px-6 py-3 rounded-md font-extrabold uppercase shadow-lg transition hover:bg-green-600 focus:ring-4 focus:ring-green-300 disabled:bg-gray-400"
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
        </button>
      </div>

      {/* Global Status Display (Success/Green pop-up color ref from image_2.png) */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-900 rounded-md font-semibold text-center">
          ✅ Mensagem enviada com sucesso!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-900 rounded-md font-semibold text-center">
          ❌ Tente novamente! (Submission Failed)
        </div>
      )}
    </form>
  );
}