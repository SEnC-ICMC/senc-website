"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import EventPicker from '@/components/admin/EventPicker';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // If not logged in - redirect to participant login page
        window.location.href = '/participant/new-registration';
        return;
      }

      const {data: participant, error} = await supabase
        .from('participants')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      console.log('DEBUG auth user id:', session.user.id);
      console.log('DEBUG participant data:', participant);
      console.log('DEBUG query error:', error);
      
      if (error || !participant?.is_admin) {
        // If not an admin - redirect to participant dashboard
        window.location.href = '/participant';
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAdminAccess();
  }, []);

  if (isLoading || !isAuthorized) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Verificando permissões...</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-900 text-white p-6 pt-20">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-black mb-4 uppercase text-green-400">
          Painel de Controle SEnC
        </h1>
        <p className="text-gray-400 mb-12">
          Sistema de credenciamento e leitura de QR Codes.
        </p>

      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-6">Selecione o evento</h2>
          <EventPicker selectedEventId={selectedEventId} onEventSelect={setSelectedEventId} />
        </div>

        {/* Placeholder for future Camera/Scanner component */}
        {selectedEventId && (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-6">Leitor de Check-in</h2>
          <div className="w-full aspect-video bg-black border border-gray-600 rounded flex items-center justify-center">
             <span className="text-gray-500 font-mono tracking-widest">[ SCANNER EM BREVE... ]</span>
          </div>
        </div>
        )}

        <Link href="/participant" className="text-gray-400 hover:text-white transition">
          &larr; Sair do modo Admin
        </Link>
      </div>
    </main>
  );
}