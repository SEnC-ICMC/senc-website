"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import EventPicker from '@/components/admin/EventPicker';
import QRScanner from '@/components/admin/QRScanner';
import NetworkBackground from '@/components/admin/NetworkBackground';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
    <main className="relative isolate min-h-screen bg-black text-white p-6 pt-20 pb-24">
      <NetworkBackground />

      {/* Brand gradient bar, top edge */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-400 to-green-400 z-20" />

      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
            X Edition
          </span>
          <h1 className="text-4xl font-black uppercase text-green-400 mt-2">
            Painel de Controle SEnC
          </h1>
          <p className="text-gray-400 mt-3">
            Sistema de credenciamento e leitura de QR Codes.
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-2xl mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-6">
            Selecione o evento
          </h2>
          <EventPicker selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
        </div>

        {selectedEventId && (
          <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-2xl mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-6">
              Leitor de Check-in
            </h2>
            <QRScanner eventId={selectedEventId} />
          </div>
        )}

        <div className="text-center">
          <Link
            href="/participant"
            className="text-gray-400 hover:text-purple-300 transition text-sm font-medium"
          >
            &larr; Sair do modo Admin
          </Link>
        </div>
      </div>
    </main>
  );
}