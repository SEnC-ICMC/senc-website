"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface AttendedEvent {
  id: string;
  events: { id: number; title: string; time_display: string; event_type: string; };
}

export default function ParticipantDashboard() {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const [attendedActivities, setAttendedActivities] = useState<AttendedEvent[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const fullName = user.user_metadata?.full_name || 'Participante';
        const firstName = fullName.split(' ')[0];
        setUserName(firstName);
        setUserEmail(user.email || '');
        setUserId(user.id);

        const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true });
        const { data: attendanceData } = await supabase.from('attendance').select(`id, events (id, title, time_display, event_type)`).eq('participant_id', user.id);
        const { data: participantRow } = await supabase.from('participants').select('is_admin').eq('id', user.id).single();

        setIsAdmin(!!participantRow?.is_admin);


        if (attendanceData) {
          const formattedData = attendanceData as unknown as AttendedEvent[];
          setAttendedActivities(formattedData);
          if (totalEvents && totalEvents > 0) {
            setAttendancePercentage(Math.round((formattedData.length / totalEvents) * 100));
          }
        }
      } else {
        window.location.href = '/participant/new-registration';
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Escape key closes the zoomed QR modal, and background scroll is
  // locked while it's open so the page doesn't shift behind it.
  useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isZoomed]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Carregando painel...</div>;
  }

  const isUspAccount = userEmail.endsWith('@usp.br');

  return (
    <main className="min-h-screen bg-gray-50 pb-20">

      {/* Soft Dark Header */}
      <div className="relative bg-gray-900 text-white pt-12 pb-24 px-6 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-purple-deep via-brand-blue to-brand-green" />

        <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-start">
          <ScrollReveal>
            <span className="block text-xs font-bold uppercase tracking-[0.3em] text-brand-purple mb-2">
              X Edition
            </span>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight">
                Olá, <span className="text-brand-green">{userName}</span>!
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUspAccount ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-gray-700 text-gray-300'}`}>
                {isUspAccount ? 'Aluno USP' : 'Externo'}
              </span>
            </div>
            <p className="text-gray-400 text-lg">Acompanhe seu progresso na X SEnC.</p>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-block mt-4 text-sm font-bold text-brand-purple hover:text-white hover:bg-brand-purple-deep border border-brand-purple transition px-4 py-2 rounded-full"
              >
                Entrar no modo admin
              </Link>
            )}
          </ScrollReveal>

          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
            className="shrink-0 text-sm font-bold text-gray-400 hover:text-white transition bg-white/10 px-4 py-2 rounded-full"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">

        {/* Credential Card */}
        <ScrollReveal>
          <div className="relative bg-white px-8 py-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center h-fit overflow-hidden">

            <h2 className="text-lg font-bold text-gray-800 mb-6 tracking-wide mt-2">Credencial de Acesso</h2>

            <div
              className="relative mb-6 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl"
              onClick={() => {
                console.log('DEBUG QR clicked, opening modal');
                setIsZoomed(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsZoomed(true);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Ampliar QR code para facilitar a leitura"
            >
              {/* Corner brackets echoing the admin scanner's viewfinder — this is the badge that frame will scan */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand-purple rounded-tl-md" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-brand-purple rounded-tr-md" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-brand-green rounded-bl-md" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-brand-green rounded-br-md" />

              <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-50 transition group-hover:shadow-lg group-hover:scale-[1.02]">
                {userId ? (
                  <QRCode value={userId} size={200} level="H" />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-lg">Erro</div>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold text-brand-purple-deep -mt-3 mb-3 uppercase tracking-wide">
              Toque para ampliar
            </p>

            <p className="text-sm text-gray-500 font-medium">
              Apresente este código para registrar sua presença.
            </p>
            <p className="text-xs text-gray-400 mt-2">{userEmail}</p>
          </div>
        </ScrollReveal>

        {/* Right Column: Stats & Logs */}
        <div className="flex flex-col gap-8">

          <ScrollReveal delay={80}>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 tracking-wide">Frequência Geral</h2>
                <span className="text-3xl font-black bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent">
                  {attendancePercentage}%
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-medium">
                Você precisa de 70% de presença para garantir o certificado geral.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 tracking-wide">Atividades Validadas</h2>

              <div className="space-y-4">
                {attendedActivities.length > 0 ? (
                  attendedActivities.map((activity) => (
                    <div key={activity.id} className="relative overflow-hidden flex items-center justify-between p-4 pl-6 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-green-400" />
                      <div>
                        <h3 className="font-bold text-gray-900">{activity.events.title}</h3>
                        <p className="text-sm text-gray-500">{activity.events.time_display}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                        Presente
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-xl">
                    Você ainda não possui presenças registradas.
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center shadow-[0_0_80px_-10px_rgba(74,222,128,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-6">Credencial de Acesso</h2>

            {userId && (
              <QRCode
                value={userId}
                size={256}
                level="H"
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
            )}

            <p className="text-sm text-gray-500 font-medium mt-6 text-center">
              Aproxime esta tela do leitor para registrar presença.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}