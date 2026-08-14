"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/participant'); 
      } else {
        setIsChecking(false); 
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/participant` }
    });
  };

  if (isChecking) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Carregando...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Acesse sua conta</h1>
          <p className="text-gray-500 mt-2">SEnC 2026 - Área do Participante</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Soft USP Rule Card */}
          <div className="bg-yellow-50 text-yellow-800 p-5 rounded-xl mb-8 border border-yellow-100">
            <h3 className="font-bold flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Alunos USP
            </h3>
            <p className="text-sm">
              Para validação de presença e abono de faltas, é obrigatório o uso do <strong>e-mail institucional (@usp.br)</strong>. Visitantes externos podem usar qualquer conta.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-500 font-medium hover:text-gray-900 transition-colors text-sm">
            &larr; Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}