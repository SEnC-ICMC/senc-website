"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the TypeScript interface matching your PostgreSQL table
interface Event {
  id: number;
  title: string;
  speaker: string | null;
  speaker_url?: string | null;
  description?: string | null;
  business_name?: string | null;
  business_url?: string | null;
  event_type: string;
  location: string;
  event_day: string;
  time_display: string;
  color_theme: string;
}

const EVENT_TAG_STYLES: Record<string, string> = {
  institucional: 'bg-blue-100 text-blue-800',
  palestra: 'bg-green-100 text-green-800',
  networking: 'bg-red-100 text-red-800',
  minicurso: 'bg-purple-100 text-purple-800',
  visita: 'bg-yellow-100 text-yellow-800',
};

function getEventTagStyle(eventType: string) {
  return EVENT_TAG_STYLES[eventType.trim().toLowerCase()] || 'bg-gray-100 text-gray-500';
}

// The navigation tabs (These stay static to define the week's dates)
const days = [
  { id: 'segunda', label: 'SEG', date: '21 Set' },
  { id: 'terca', label: 'TER', date: '22 Set' },
  { id: 'quarta', label: 'QUA', date: '23 Set' },
  { id: 'quinta', label: 'QUI', date: '24 Set' },
  { id: 'sexta', label: 'SEX', date: '25 Set' },
];

export default function Programacao() {
  const [activeDay, setActiveDay] = useState('segunda');
  const [eventsData, setEventsData] = useState<Record<string, Event[]>>({
    segunda: [], terca: [], quarta: [], quinta: [], sexta: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true }); // Keeps chronological order

      if (error) {
        console.error("Erro ao buscar eventos:", JSON.stringify(error, null, 2));
      } else if (data) {
        // Group the flat database rows into days
        const grouped: Record<string, Event[]> = {
          segunda: [], terca: [], quarta: [], quinta: [], sexta: []
        };
        
        data.forEach((event: Event) => {
          if (grouped[event.event_day]) {
            grouped[event.event_day].push(event);
          }
        });

        setEventsData(grouped);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const currentEvents = eventsData[activeDay] || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-24">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
          Programação
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore as palestras, workshops e eventos recreativos da X SEnC.
        </p>
      </div>

      {/* DAY NAVIGATION TABS */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex justify-between md:justify-center gap-2 md:gap-4 overflow-x-auto pb-4 hide-scroll-bar">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px] py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                activeDay === day.id
                  ? 'bg-brand-green text-brand-dark shadow-lg scale-105'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm md:text-base uppercase tracking-wider">{day.label}</span>
              <span className={`text-xs mt-1 ${activeDay === day.id ? 'text-brand-dark' : 'text-gray-400'}`}>
                {day.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AGENDA TIMELINE */}
      <div className="max-w-4xl mx-auto px-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="text-gray-400 font-medium animate-pulse">Carregando programação...</span>
          </div>
        ) : currentEvents.length > 0 ? (
          <div className="space-y-6">
            {currentEvents.map((event) => {
              const hasEventDetails = [
                event.description,
                event.speaker_url,
                event.business_name,
                event.business_url,
              ].some((value) => Boolean(value?.trim()));

              const eventSummary = (
                <>
                  <div className="flex-shrink-0 md:w-48">
                    <span className="text-lg font-black tracking-tight text-gray-900">{event.time_display}</span>
                    <span className={`mt-2 block w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getEventTagStyle(event.event_type)}`}>
                      {event.event_type}
                    </span>
                  </div>

                  <div className="min-w-0 flex-grow">
                    <h3 className="mb-1 text-xl font-bold text-gray-900">{event.title}</h3>
                    {event.speaker && (
                      <p className="mb-2 font-medium text-gray-600">{event.speaker}</p>
                    )}
                    <div className="mt-3 flex items-center text-sm font-medium text-gray-500">
                      <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>

                </>
              );

              return (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {hasEventDetails ? (
                    <button
                      type="button"
                      aria-expanded={expandedEventId === event.id}
                      aria-controls={`event-details-${event.id}`}
                      onClick={() => setExpandedEventId((currentId) => currentId === event.id ? null : event.id)}
                      className="flex w-full flex-col gap-6 p-6 text-left md:flex-row md:items-center"
                    >
                      {eventSummary}
                      <span className="flex-shrink-0 text-sm font-bold text-brand-purple-deep">
                        {expandedEventId === event.id ? 'Fechar' : 'Ver detalhes'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                      {eventSummary}
                    </div>
                  )}

                {hasEventDetails && expandedEventId === event.id && (
                  <div id={`event-details-${event.id}`} className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                    {event.description ? (
                      <p className="max-w-3xl whitespace-pre-line text-gray-700">{event.description}</p>
                    ) : (
                      <p className="text-gray-500">Mais informações sobre este evento serão divulgadas em breve.</p>
                    )}

                    {(event.speaker_url || event.business_url) && (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                        {event.speaker_url && event.speaker && (
                          <a href={event.speaker_url} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
                            Conheça {event.speaker}
                          </a>
                        )}
                        {event.business_url && (
                          <a href={event.business_url} target="_blank" rel="noreferrer" className="text-brand-purple-deep hover:underline">
                            {event.business_name || 'Saiba mais sobre a organização'}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">Nenhum evento agendado para este dia ainda.</p>
          </div>
        )}
      </div>

      <div className="text-center mt-16">
          <Link href="/" className="text-brand-purple-deep font-bold hover:text-brand-blue hover:underline">
            &larr; Voltar para a Home
          </Link>
      </div>

    </main>
  );
}