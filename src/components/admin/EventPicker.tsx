"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface EventRow {
  id: number;
  title: string;
  speaker: string;
  event_type: string;
  location: string;
  time_display: string;
  color_theme: string;
  starts_at: string;
  ends_at: string;
}

interface EventPickerProps {
  selectedEventId: number | null;
  onSelectEvent: (eventId: number) => void;
}

type EventStatus = 'now' | 'upcoming' | 'past';

function getEventStatus(event: EventRow, now: Date): EventStatus {
  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);
  if (now >= start && now <= end) return 'now';
  if (now < start) return 'upcoming';
  return 'past';
}

interface Section {
  label: string;
  status: EventStatus;
  limit?: number;
  takeFrom?: 'start' | 'end';
}

const SECTIONS: Section[] = [
  { label: 'Acontecendo agora', status: 'now' },
  { label: 'Próximos', status: 'upcoming', limit: 3, takeFrom: 'start' },
  { label: 'Anteriores', status: 'past', limit: 1, takeFrom: 'end' },
];

export default function EventPicker({ selectedEventId, onSelectEvent }: EventPickerProps) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, speaker, event_type, location, time_display, color_theme, starts_at, ends_at')
        .order('starts_at', { ascending: true });

      if (!error && data) {
        const rows = data as EventRow[];
        setEvents(rows);

        // Default selection on first load only: prefer whatever is
        // happening right now, otherwise the soonest upcoming event.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (selectedEventId === null) {
          const now = new Date();
          const current = rows.find((e) => getEventStatus(e, now) === 'now');
          const nextUpcoming = rows.find((e) => getEventStatus(e, now) === 'upcoming');
          const defaultEvent = current || nextUpcoming;
          if (defaultEvent) onSelectEvent(defaultEvent.id);
        }
      }
      setIsLoading(false);
    };

    fetchEvents();

    // Recompute now/upcoming/past every minute so the sectioning stays
    // accurate without needing a manual refresh.
    const interval = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Carregando eventos...</p>;
  }

  if (events.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhum evento cadastrado.</p>;
  }

  const now = new Date();

  return (
    <div className="w-full text-left space-y-6">
      {SECTIONS.map(({ label, status }) => {
        const filtered = events.filter((e) => getEventStatus(e, now) === status);
        if (filtered.length === 0) return null;

        return (
          <div key={status}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</h3>
            <div className="space-y-2">
              {filtered.map((event) => {
                const isSelected = event.id === selectedEventId;
                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500/10 to-green-400/10 border-green-400 text-green-300'
                        : 'bg-white/[0.02] border-white/10 hover:border-purple-400/60 text-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <span className="font-bold">{event.title}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{event.time_display}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {event.speaker} · {event.location}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}