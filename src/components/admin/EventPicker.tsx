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
    onEventSelect: (eventId: number) => void;
}

type EventStatus = 'now' | 'upcoming' | 'past';

function getEventStatus(event: EventRow, now: Date): EventStatus {
    const startsAt = new Date(event.starts_at);
    const endsAt = new Date(event.ends_at);

    if (now >= startsAt && now <= endsAt) {
        return 'now';
    } else if (now < startsAt) {
        return 'upcoming';
    } else {
        return 'past';
    }
}

const SECTIONS: {label: string, status: EventStatus}[] = [
    { label: 'Acontecendo agora', status: 'now' },
    { label: 'Próximos', status: 'upcoming' },
    { label: 'Passados', status: 'past' },
];

export default function EventPicker({ selectedEventId, onEventSelect }: EventPickerProps) {
    const [events, setEvents] = useState<EventRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [, forceTick] = useState(0); // Used to force re-render every minute

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('starts_at', { ascending: true });

            if (!error && data) {
                const rows = data as EventRow[];
                setEvents(rows);

                if (selectedEventId === null && rows.length > 0) {
                    const now = new Date();
                    const current = rows.find((e) => getEventStatus(e, now) === 'now');
                    const nextUpcoming = rows.find((e) => getEventStatus(e, now) === 'upcoming');
                    const defaultEvent = current || nextUpcoming || rows[0];
                    if (defaultEvent) {
                        onEventSelect(defaultEvent.id);
                    }
                }
            }
            setIsLoading(false);
        };

        fetchEvents();

        const interval = setInterval(() => forceTick((t) => t + 1), 60000); // Force re-render every minute
        return () => clearInterval(interval);
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
                const filteredEvents = events.filter((event) => getEventStatus(event, now) === status);
                if (filteredEvents.length === 0) {
                    return null;
                }
                return (
                    <div key={status}>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">{label}</h3>
                        <div className="space-y-2">
                            {filteredEvents.map((event) => {
                                const isSelected = event.id === selectedEventId;
                                return (
                                    <button
                                        key={event.id}
                                        onClick={() => onEventSelect(event.id)}
                                        className={`w-full text-left p-4 rounded-lg border transition ${
                                            isSelected
                                                ? 'bg-green-400/10 border-green-400 text-green-300'
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-500 text-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="font-bold">{event.title}</span>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{event.time_display}</span>
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            {event.speaker} - {event.location}
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
