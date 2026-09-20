"use client";

import { useEffect, useState } from 'react';

// Adjust if the real opening time differs from midnight local time.
const EVENT_START = new Date('2026-09-21T00:08:30-03:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, EVENT_START.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    const initialUpdate = window.setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      window.clearTimeout(initialUpdate);
      clearInterval(interval);
    };
  }, []);

  // Avoid a server/client mismatch flash — render nothing until mounted.
  if (!timeLeft) return null;

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Ao vivo
        </span>
        <p className="text-3xl font-black uppercase leading-tight tracking-wide text-green-600 sm:text-4xl md:text-5xl">
          A X SEnC já começou!
        </p>
        <p className="mt-3 text-sm font-semibold text-gray-700 md:text-base">
          Acompanhe nas nossas redes sociais!
        </p>
        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="https://www.youtube.com/@SEnC-USP"
            target="_blank"
            rel="noreferrer"
            aria-label="Acompanhe a SEnC no YouTube"
            className="flex min-h-16 flex-1 items-center justify-center gap-4 rounded-xl border border-red-100 bg-red-50 px-7 py-4 text-lg font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <svg aria-hidden="true" className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
            </svg>
            YouTube
          </a>
          <a
            href="https://instagram.com/senc.usp"
            target="_blank"
            rel="noreferrer"
            aria-label="Acompanhe a SEnC no Instagram"
            className="flex min-h-16 flex-1 items-center justify-center gap-4 rounded-xl border border-pink-100 bg-pink-50 px-7 py-4 text-lg font-bold text-pink-700 transition-colors hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            <svg aria-hidden="true" className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
        </div>
      </div>
    );
  }

  const units = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
      {units.map((item) => (
        <div key={item.label} className="w-32 md:w-40 flex flex-col items-center text-center">
          <div className="relative bg-white w-full h-32 md:h-40 flex items-center justify-center rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <span className="text-6xl md:text-7xl font-black text-gray-950 font-mono tracking-tighter tabular-nums">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="mt-4 text-sm font-semibold uppercase tracking-wider text-gray-600">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
