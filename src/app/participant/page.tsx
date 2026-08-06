"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'react-qr-code';
import Link from 'next/link';

// Initialize Supabase (Using the exact same setup as your login page)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MOCK DATA (To be replaced with real database queries later) ---
const MOCK_ATTENDANCE_PERCENTAGE = 60;
const MOCK_ACTIVITIES = [
  { id: 1, name: 'Palestra: O Futuro da IA', time: 'Segunda, 10:00', type: 'Palestra' },
  { id: 2, name: 'Workshop: React Native', time: 'Terça, 14:00', type: 'Workshop' },
  { id: 3, name: 'Coffee Break Networking', time: 'Quarta, 16:00', type: 'Evento' },
];

export default function ParticipantDashboard() {
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the logged-in user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Extract the first name for a friendlier greeting
        const fullName = user.user_metadata?.full_name || 'Participante';
        const firstName = fullName.split(' ')[0];
        
        setUserName(firstName);
        setUserId(user.id); // We use this unique ID for the QR Code
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Carregando painel...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-brand-dark text-white pt-12 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Bem-vindo, <span className="text-green-400">{userName}</span>!
            </h1>
            <p className="text-gray-400 text-lg">Acompanhe seu progresso na X SEnC.</p>
          </div>
          <Link href="/" className="text-sm font-bold text-gray-300 hover:text-white transition">
            &larr; Voltar ao Início
          </Link>
        </div>
      </div>

      {/* DASHBOARD GRID CONTENT */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        
        {/* LEFT COLUMN: The QR Code Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wider">Seu Check-in</h2>
          
          <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-100 mb-6">
            {/* If we have an ID, generate the QR. Otherwise, show an error. */}
            {userId ? (
              <QRCode value={userId} size={200} level="H" />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Erro ao gerar QR
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 font-medium">
            Apresente este código na entrada de cada atividade para registrar sua presença.
          </p>
        </div>

        {/* RIGHT COLUMN: Progress & History */}
        <div className="flex flex-col gap-8">
          
          {/* Card 1: Attendance Progress Bar */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Frequência Geral</h2>
              <span className="text-3xl font-black text-green-500">{MOCK_ATTENDANCE_PERCENTAGE}%</span>
            </div>
            
            {/* The Progress Bar UI */}
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${MOCK_ATTENDANCE_PERCENTAGE}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              Você precisa de 70% de presença para garantir o certificado geral da semana.
            </p>
          </div>

          {/* Card 2: Activity History */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wider">Atividades Validadas</h2>
            
            <div className="space-y-4">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                    Presente
                  </span>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}