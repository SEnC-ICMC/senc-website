"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ADMIN_ATTENDANCE_EVENT_TYPES, isAttendanceEventType } from '@/lib/attendance';

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
  onSelectEvent: (eventId: number, eventType: string) => void;
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

        const rows = data.filter((e) => isAttendanceEventType(e.event_type, ADMIN_ATTENDANCE_EVENT_TYPES)) as EventRow[];
        setEvents(rows);

        // Default selection on first load only: prefer whatever is
        // happening right now, otherwise the soonest upcoming event.
        if (selectedEventId === null) {
          const now = new Date();
          const current = rows.find((e) => getEventStatus(e, now) === 'now');
          const nextUpcoming = rows.find((e) => getEventStatus(e, now) === 'upcoming');
          const defaultEvent = current || nextUpcoming;
          if (defaultEvent) onSelectEvent(defaultEvent.id, defaultEvent.event_type);
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
    <div className="w-full text-left space-y-7">
      {SECTIONS.map(({ label, status, limit, takeFrom }) => {
        let filtered = events.filter((e) => getEventStatus(e, now) === status);
        if (filtered.length === 0) return null;

        let hiddenCount = 0;
        if (limit && filtered.length > limit) {
          hiddenCount = filtered.length - limit;
          filtered = takeFrom === 'end' ? filtered.slice(-limit) : filtered.slice(0, limit);
        }

        const statusLabel = status === 'now' ? 'Agora' : status === 'upcoming' ? 'Em breve' : 'Encerrado';
        const statusStyle = status === 'now'
          ? 'bg-green-400/15 text-green-300 border-green-400/25'
          : status === 'upcoming'
            ? 'bg-blue-400/15 text-blue-300 border-blue-400/25'
            : 'bg-white/5 text-gray-400 border-white/10';

        return (
          <div key={status}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                {label}
              </h3>
              {hiddenCount > 0 && (
                <span className="text-xs text-gray-500">
                  +{hiddenCount} não exibido{hiddenCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {filtered.map((event) => {
                const isSelected = event.id === selectedEventId;
                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event.id, event.event_type)}
                    className={`group w-full rounded-xl border p-4 text-left shadow-sm transition sm:p-5 ${
                      isSelected
                        ? 'border-green-400/80 bg-green-400/10 text-white shadow-[0_0_24px_-14px_rgba(7,212,106,0.9)]'
                        : 'border-white/10 bg-white/[0.025] text-gray-200 hover:border-blue-400/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyle}`}>
                            {statusLabel}
                          </span>
                          {isSelected && (
                            <span className="text-xs font-bold text-green-300">Selecionado</span>
                          )}
                        </div>
                        <span className="block font-bold leading-snug text-white group-hover:text-green-300 transition-colors">
                          {event.title}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-gray-300 whitespace-nowrap">{event.time_display}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-sm text-gray-400">
                      <span>{event.speaker}</span>
                      <span>{event.location}</span>
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