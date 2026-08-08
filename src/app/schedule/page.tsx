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
  event_type: string;
  location: string;
  event_day: string;
  time_display: string;
  color_theme: string;
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
                  ? 'bg-green-500 text-brand-dark shadow-lg scale-105'
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
            {currentEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"
              >
                {/* Time & Type Block */}
                <div className="md:w-48 flex-shrink-0 flex flex-col items-start">
                  <span className="text-lg font-black text-gray-900 tracking-tight">{event.time_display}</span>
                  <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.color_theme}`}>
                    {event.event_type}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                  {event.speaker && (
                    <p className="text-gray-600 font-medium mb-2">{event.speaker}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 font-medium mt-3">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">Nenhum evento agendado para este dia ainda.</p>
          </div>
        )}
      </div>

      <div className="text-center mt-16">
          <Link href="/" className="text-green-600 font-bold hover:underline">
            &larr; Voltar para a Home
          </Link>
      </div>

    </main>
  );
}