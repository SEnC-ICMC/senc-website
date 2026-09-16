"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import EventPicker from '@/components/admin/EventPicker';
import QRScanner from '@/components/admin/QRScanner';
import AttendanceList from '@/components/admin/AttendanceList';
import NetworkBackground from '@/components/admin/NetworkBackground';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [attendanceRefreshToken, setAttendanceRefreshToken] = useState(0);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/participant/new-registration';
        return;
      }

      const { data: participant, error } = await supabase
        .from('participants')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !participant?.is_admin) {
        window.location.href = '/participant';
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAdminAccess();
  }, []);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400 font-medium">
        Verificando permissões...
      </div>
    );
  }

  return (
    <main className="relative isolate min-h-screen bg-[#050706] text-white px-4 py-8 pb-20 sm:px-6 lg:px-8">
      <div className="opacity-45">
        <NetworkBackground />
      </div>

      {/* Brand gradient bar, top edge */}
      <div className="fixed top-0 left-0 z-20 h-1 w-full bg-gradient-to-r from-[#6d5dfc] via-[#5ce1e6] to-[#c6f36b]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#5ce1e6]">Administração</span>
            </div>
            <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-wide text-white sm:text-4xl">Credenciamento</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-400 sm:text-base">
              Gerencie o acesso às palestras e acompanhe a presença em tempo real.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section className="rounded-xl border border-[#29342e] bg-[#0d110f] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] lg:col-span-4 lg:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#5ce1e6]">01 / Evento</p>
                <h2 className="font-display mt-2 text-xl font-bold uppercase tracking-wide text-white">Sessão ativa</h2>
              </div>
            </div>
            <EventPicker selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
          </section>

          {selectedEventId && (
            <section className="rounded-xl border border-[#29342e] bg-[#0d110f] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] lg:col-span-8 lg:p-6">
              <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#5ce1e6]">02 / Check-in</p>
                  <h2 className="font-display mt-2 text-2xl font-bold uppercase tracking-wide text-white">Leitor de presença</h2>
                </div>
              </div>
              <QRScanner
                eventId={selectedEventId}
                onAttendanceRegistered={() => setAttendanceRefreshToken((token) => token + 1)}
              />
            </section>
          )}

          {selectedEventId && (
            <section className="rounded-xl border border-[#29342e] bg-[#0d110f] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] lg:col-span-12 lg:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5ce1e6]">03 / Monitoramento</span>
                <span className="h-px flex-1 bg-white/10" />
                <span className="hidden text-xs text-gray-500 sm:inline">Atualizado após cada leitura</span>
              </div>
              <AttendanceList eventId={selectedEventId} refreshToken={attendanceRefreshToken} />
            </section>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-gray-600">
          <span>SEnC 2026</span>
        </div>
      </div>
    </main>
  );
}