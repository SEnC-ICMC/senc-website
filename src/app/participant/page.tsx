"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import QRCode from 'react-qr-code';
import Link from 'next/link';

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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Carregando painel...</div>;
  }

  const isUspAccount = userEmail.endsWith('@usp.br');

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* Soft Dark Header */}
      <div className="bg-gray-900 text-white pt-12 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight">
                Olá, <span className="text-green-400">{userName}</span>!
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUspAccount ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-gray-700 text-gray-300'}`}>
                {isUspAccount ? 'Aluno USP' : 'Externo'}
              </span>
            </div>
            <p className="text-gray-400 text-lg">Acompanhe seu progresso na X SEnC.</p>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-block mt-4 text-sm font-bold text-purple-300 hover:text-black hover:bg-purple-400 border border-purple-400 transition px-4 py-2 rounded-full"
              >
                Entrar no modo admin
              </Link>
            )}
          </div>
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
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-6 tracking-wide">Credencial de Acesso</h2>
          <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-50 mb-6">
            {userId ? (
              <QRCode value={userId} size={200} level="H" />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-lg">Erro</div>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Apresente este código para registrar sua presença.
          </p>
          <p className="text-xs text-gray-400 mt-2">{userEmail}</p>
        </div>

        {/* Right Column: Stats & Logs */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-gray-800 tracking-wide">Frequência Geral</h2>
              <span className="text-3xl font-black text-green-500">{attendancePercentage}%</span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              Você precisa de 70% de presença para garantir o certificado geral.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 tracking-wide">Atividades Validadas</h2>
            
            <div className="space-y-4">
              {attendedActivities.length > 0 ? (
                attendedActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition">
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

        </div>
      </div>
    </main>
  );
}