"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { DEFAULT_ATTENDANCE_EVENT_TYPES, isAttendanceEventType } from '@/lib/attendance';

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

        const { data: eventsData } = await supabase.from('events').select('event_type');
        const { data: attendanceData } = await supabase.from('attendance').select(`id, events (id, title, time_display, event_type)`).eq('participant_id', user.id);
        const { data: participantRow } = await supabase.from('participants').select('is_admin').eq('id', user.id).single();

        setIsAdmin(!!participantRow?.is_admin);


        if (attendanceData) {
          const formattedData = (attendanceData as unknown as AttendedEvent[]).filter((attendance) => (
            attendance.events && isAttendanceEventType(attendance.events.event_type, DEFAULT_ATTENDANCE_EVENT_TYPES)
          ));
          const totalAttendanceEvents = (eventsData ?? []).filter((event) => (
            isAttendanceEventType(event.event_type, DEFAULT_ATTENDANCE_EVENT_TYPES)
          )).length;

          setAttendedActivities(formattedData);
          if (totalAttendanceEvents > 0) {
            setAttendancePercentage(Math.round((formattedData.length / totalAttendanceEvents) * 100));
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
    return <div className="flex min-h-screen items-center justify-center bg-brand-light font-medium text-gray-500">Carregando painel...</div>;
  }

  const isUspAccount = userEmail.endsWith('@usp.br');

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 text-gray-900">

      <div className="relative overflow-hidden border-b border-[#29342e] bg-gradient-to-br from-[#0c0714] via-[#0b1024] to-[#07101d] px-6 pb-24 pt-12 text-white">
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-brand-purple-deep to-brand-blue" />

        <div className="relative z-10 max-w-5xl mx-auto flex justify-between items-start">
          <ScrollReveal>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.3em] text-[#5ce1e6]">
              Área do participante
            </span>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Olá, <span className="text-brand-green">{userName}</span>
              </h1>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isUspAccount ? 'border-[#5ce1e6]/30 bg-[#5ce1e6]/10 text-[#5ce1e6]' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                {isUspAccount ? 'Aluno USP' : 'Externo'}
              </span>
            </div>
            <p className="text-lg text-gray-400">Acompanhe seu progresso na X SEnC.</p>

            {isAdmin && (
              <Link
                href="/admin"
                className="mt-4 inline-block rounded-lg border border-brand-purple/60 px-4 py-2 text-sm font-bold text-brand-purple transition hover:bg-brand-purple-deep hover:text-white"
              >
                Entrar no modo admin
              </Link>
            )}
          </ScrollReveal>

          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-400 transition hover:border-brand-green/40 hover:text-white"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">

        {/* Credential Card */}
        <ScrollReveal>
            <div className="relative flex h-fit flex-col items-center overflow-hidden rounded-xl border border-gray-200 bg-white px-8 py-4 text-center shadow-[0_18px_42px_rgba(25,40,32,0.14)]">

            <h2 className="mt-2 mb-6 text-lg font-bold tracking-wide text-gray-900">Credencial de Acesso</h2>

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

              <div className="rounded-xl border-2 border-gray-100 bg-white p-4 shadow-inner transition group-hover:scale-[1.02] group-hover:shadow-lg">
                {userId ? (
                  <QRCode value={userId} size={200} level="H" />
                ) : (
                  <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">Erro</div>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold text-brand-purple-deep -mt-3 mb-3 uppercase tracking-wide">
              Toque para ampliar
            </p>

            <p className="text-sm font-medium text-gray-500">
              Apresente este código para registrar sua presença.
            </p>
            <p className="mt-2 text-xs text-gray-500">{userEmail}</p>
          </div>
        </ScrollReveal>

        {/* Right Column: Stats & Logs */}
        <div className="flex flex-col gap-8">

          <ScrollReveal delay={80}>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-[0_18px_42px_rgba(25,40,32,0.14)]">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold tracking-wide text-gray-900">Frequência Geral</h2>
                <span className="bg-gradient-to-r from-brand-purple-deep to-brand-blue bg-clip-text text-3xl font-black text-transparent">
                  {attendancePercentage}%
                </span>
              </div>

              <div className="h-4 w-full overflow-hidden rounded-full border border-gray-300 bg-gray-200 shadow-inner">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-brand-purple-deep to-brand-blue transition-all duration-1000 ease-out"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                Você precisa de 70% de presença para garantir o certificado geral.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-[0_18px_42px_rgba(25,40,32,0.14)]">
              <h2 className="mb-6 text-lg font-bold tracking-wide text-gray-900">Atividades Validadas</h2>

              <div className="space-y-4">
                {attendedActivities.length > 0 ? (
                  attendedActivities.map((activity) => (
                    <div key={activity.id} className="relative flex items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-brand-light p-4 pl-6 transition hover:border-brand-green/40 hover:bg-white hover:shadow-sm">
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-purple to-brand-blue" />
                      <div>
                        <h3 className="font-bold text-gray-900">{activity.events.title}</h3>
                        <p className="text-sm text-gray-500">{activity.events.time_display}</p>
                      </div>
                      <span className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-bold tracking-wide text-brand-green">
                        Presente
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center font-medium text-gray-500">
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
            className="relative flex w-full max-w-sm flex-col items-center rounded-xl border border-gray-200 bg-white p-8 shadow-[0_0_80px_-10px_rgba(7,212,106,0.24)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-900"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-lg font-bold text-gray-900">Credencial de Acesso</h2>

            {userId && (
              <QRCode
                value={userId}
                size={256}
                level="H"
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
            )}

            <p className="mt-6 text-center text-sm font-medium text-gray-500">
              Aproxime esta tela do leitor para registrar presença.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}