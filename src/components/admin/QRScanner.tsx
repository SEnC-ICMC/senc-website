"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '@/lib/supabase/client';

type ScanStatus =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'processing'
  | 'success'
  | 'duplicate'
  | 'not_found'
  | 'camera_denied'
  | 'error';

interface QRScannerProps {
  eventId: number;
}

const READER_ELEMENT_ID = 'qr-reader';
const RESUME_DELAY_MS = 2200;

export default function QRScanner({ eventId }: QRScannerProps) {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [isActive, setIsActive] = useState(false);

  // Kept in a ref so the scan handler always sees the current event
  // without needing to restart the camera when the admin switches events.
  const eventIdRef = useRef(eventId);
  useEffect(() => {
    eventIdRef.current = eventId;
  }, [eventId]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStartedRef = useRef(false);
  const lastScanRef = useRef<{ uuid: string; time: number } | null>(null);

  const scheduleResume = () => {
    setTimeout(() => {
      const scanner = scannerRef.current;
      // Guard against resuming a scanner the admin has since deactivated.
      if (scanner && hasStartedRef.current) {
        scanner.resume();
        setStatus('scanning');
      }
    }, RESUME_DELAY_MS);
  };

  const handleDecode = async (decodedText: string) => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    const now = Date.now();
    if (
      lastScanRef.current &&
      lastScanRef.current.uuid === decodedText &&
      now - lastScanRef.current.time < RESUME_DELAY_MS
    ) {
      return;
    }
    lastScanRef.current = { uuid: decodedText, time: now };

    scanner.pause(true);
    setStatus('processing');

    const { data: participant, error: lookupError } = await supabase
      .from('participants')
      .select('name')
      .eq('uuid', decodedText)
      .single();

    if (lookupError || !participant) {
      setStatus('not_found');
      setMessage('QR code não corresponde a nenhum participante cadastrado.');
      scheduleResume();
      return;
    }

    const { error: insertError } = await supabase
      .from('attendance')
      .insert({ event_id: eventIdRef.current, participant_id: decodedText });

    if (insertError) {
      if (insertError.code === '23505') {
        setStatus('duplicate');
        setMessage(`${participant.name} já registrou presença neste evento.`);
      } else {
        setStatus('error');
        setMessage('Erro ao registrar presença. Tente novamente.');
      }
      scheduleResume();
      return;
    }

    setStatus('success');
    setMessage(`Presença registrada: ${participant.name}`);
    scheduleResume();
  };

  const handleActivate = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(READER_ELEMENT_ID);
    }
    const scanner = scannerRef.current;
    setStatus('starting');
    setMessage('');

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        handleDecode,
        () => {
          // Fires continuously while no QR is in frame — expected, not an error.
        }
      );
      hasStartedRef.current = true;
      setIsActive(true);
      setStatus('scanning');
    } catch {
      setStatus('camera_denied');
      setMessage('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const handleDeactivate = async () => {
    const scanner = scannerRef.current;
    if (!scanner || !hasStartedRef.current) return;

    hasStartedRef.current = false;
    try {
      await scanner.stop();
      await scanner.clear();
    } catch {
      // Already stopped — safe to ignore.
    }
    setIsActive(false);
    setStatus('idle');
    setMessage('');
  };

  // Safety net: stop the camera if the admin navigates away entirely
  // without pressing "Desativar".
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner && hasStartedRef.current) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black border border-white/10 rounded-lg overflow-hidden shadow-[0_0_40px_-12px_rgba(168,85,247,0.5)]">
        <div id={READER_ELEMENT_ID} className="w-full h-full" />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90">
            <button
              onClick={handleActivate}
              disabled={status === 'starting'}
              className="text-sm font-bold px-5 py-2.5 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition disabled:opacity-50"
            >
              {status === 'starting' ? 'Ativando câmera...' : 'Ativar leitor'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 min-h-[3rem] flex flex-col items-center justify-center text-center px-4 gap-2">
        {status === 'scanning' && (
          <span className="text-gray-500 text-sm">Aponte a câmera para o QR code do participante.</span>
        )}
        {status === 'processing' && <span className="text-gray-400 text-sm">Verificando...</span>}
        {status === 'success' && <span className="text-green-400 font-bold">{message}</span>}
        {status === 'duplicate' && <span className="text-yellow-400 font-bold">{message}</span>}
        {status === 'not_found' && <span className="text-red-400 font-bold">{message}</span>}
        {status === 'error' && <span className="text-red-400 font-bold">{message}</span>}
        {status === 'camera_denied' && (
          <div className="text-red-400">
            <p className="font-bold mb-2">{message}</p>
            <button
              onClick={handleActivate}
              className="text-sm font-bold px-4 py-2 rounded-full border border-red-400 hover:bg-red-400 hover:text-black transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {isActive && status !== 'camera_denied' && (
          <button
            onClick={handleDeactivate}
            className="text-xs text-gray-500 hover:text-purple-300 underline transition"
          >
            Desativar leitor
          </button>
        )}
      </div>
    </div>
  );
}