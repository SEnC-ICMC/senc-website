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
  onAttendanceRegistered?: () => void;
}

const READER_ELEMENT_ID = 'qr-reader';
const RESUME_DELAY_MS = 2200;

export default function QRScanner({ eventId, onAttendanceRegistered }: QRScannerProps) {
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
    onAttendanceRegistered?.();
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
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.68);
            return { width: size, height: size };
          },
        },
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
    <div className="qr-scanner w-full [&_#qr-shaded-region]:hidden">
      <div className="relative mx-auto min-h-[18rem] aspect-[5/4] w-full max-w-xl overflow-hidden rounded-xl border border-black/40 bg-[#050807] sm:min-h-[24rem] sm:aspect-[4/3]">
        <div id={READER_ELEMENT_ID} className="w-full h-full" />

        {isActive && status === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="relative aspect-square w-[min(62vw,22rem)] rounded-xl border-2 border-green-400 shadow-[0_0_0_999px_rgba(0,0,0,0.3)]">
              <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-green-400 rounded-full" />
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-green-400 rounded-full" />
            </div>
            <span className="mt-5 rounded-full bg-black/75 px-4 py-2 text-sm font-semibold text-white">
              Posicione o QR code dentro da moldura
            </span>
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-center px-6">
            <div className="mb-5 flex h-12 w-16 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04]">
              <span className="relative h-6 w-9 rounded-md border-2 border-gray-300/80">
                <span className="absolute -top-1.5 left-2 h-1.5 w-3 rounded-t-sm bg-gray-300/80" />
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-400/80" />
              </span>
            </div>
            <p className="text-lg font-bold text-white">Câmera pronta para o check-in</p>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
              Deixe o leitor aberto e peça para cada participante mostrar o QR code nesta área.
            </p>
            <button
              onClick={handleActivate}
              disabled={status === 'starting'}
              className="mt-6 rounded-lg bg-green-400 px-6 py-3 text-sm font-black text-black transition hover:bg-green-300 disabled:opacity-50"
            >
              {status === 'starting' ? 'Ativando câmera...' : 'Ativar câmera'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 min-h-[5.5rem] flex flex-col items-center justify-center text-center px-4 gap-2">
        {status === 'scanning' && (
          <span className="inline-flex items-center gap-2 text-green-400 text-sm font-bold">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
            Leitor ativo · aguardando próximo participante
          </span>
        )}
        {status === 'processing' && <span className="text-gray-400 text-sm">Verificando...</span>}
        {status === 'success' && <span className="text-green-400 font-bold">{message}</span>}
        {status === 'duplicate' && <span className="text-[#5ce1e6] font-bold">{message}</span>}
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