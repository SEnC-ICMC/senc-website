"use client";

import { useEffect, useState } from 'react';

// Adjust if the real opening time differs from midnight local time.
const EVENT_START = new Date('2026-09-21T00:00:00-03:00');

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
      <p className="text-2xl md:text-3xl font-black text-green-600 uppercase tracking-wide text-center">
        A X SEnC já começou! 🎉
      </p>
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