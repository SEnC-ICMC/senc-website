"use client";

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AttendanceRecord {
  id: string;
  participant_id: string;
  checked_in_at: string | null;
  participants: {
    name: string;
    email: string;
  };
}

interface TargetEvent {
  id: number;
  title: string;
  time_display: string;
}

interface AttendanceListProps {
  eventId: number;
  refreshToken: number;
}

function formatCheckInTime(timestamp: string | null) {
  if (!timestamp) return 'Horário não informado';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export default function AttendanceList({ eventId, refreshToken }: AttendanceListProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [targetEvents, setTargetEvents] = useState<TargetEvent[]>([]);
  const [isCopyPanelOpen, setIsCopyPanelOpen] = useState(false);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);
  const [copyTargetId, setCopyTargetId] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    const fetchAttendance = async () => {
      setIsLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('attendance')
        .select('id, participant_id, checked_in_at, participants!inner(name, email)')
        .eq('event_id', eventId)
        .order('checked_in_at', { ascending: false });

      if (!isCurrent) return;

      if (error) {
        setErrorMessage('Não foi possível carregar a lista de presentes.');
      } else {
        setAttendance((data ?? []) as unknown as AttendanceRecord[]);
      }
      setIsLoading(false);
    };

    fetchAttendance();

    return () => {
      isCurrent = false;
    };
  }, [eventId, refreshToken]);

  const filteredAttendance = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    if (!normalizedSearch) return attendance;

    return attendance.filter((record) => {
      const participant = record.participants;
      return participant?.name.toLocaleLowerCase().includes(normalizedSearch)
        || participant?.email.toLocaleLowerCase().includes(normalizedSearch);
    });
  }, [attendance, search]);

  const handleRemove = async (record: AttendanceRecord) => {
    const participantName = record.participants?.name ?? 'este participante';
    if (!window.confirm(`Remover a presença de ${participantName}?`)) return;

    setRemovingId(record.id);
    const { error } = await supabase.from('attendance').delete().eq('id', record.id);

    if (error) {
      setErrorMessage('Não foi possível remover esta presença.');
    } else {
      setAttendance((current) => current.filter((item) => item.id !== record.id));
    }
    setRemovingId(null);
  };

  const handleOpenCopyPanel = async () => {
    setIsCopyPanelOpen((isOpen) => !isOpen);
    setCopyMessage('');
    if (targetEvents.length > 0) return;

    setIsLoadingTargets(true);
    const { data, error } = await supabase
      .from('events')
      .select('id, title, time_display')
      .eq('event_type', 'Palestra')
      .order('starts_at', { ascending: true });

    if (error) {
      setErrorMessage('Não foi possível carregar os eventos de destino.');
    } else {
      setTargetEvents((data ?? []) as TargetEvent[]);
    }
    setIsLoadingTargets(false);
  };

  const handleCopyAttendance = async () => {
    const destinationEventId = Number(copyTargetId);
    if (!destinationEventId || attendance.length === 0) return;

    const destinationEvent = targetEvents.find((event) => event.id === destinationEventId);
    if (!destinationEvent) return;

    if (!window.confirm(`Copiar ${attendance.length} presença${attendance.length === 1 ? '' : 's'} para ${destinationEvent.title}?`)) return;

    setIsCopying(true);
    setCopyMessage('');
    setErrorMessage('');

    const { data: existingRecords, error: existingError } = await supabase
      .from('attendance')
      .select('participant_id')
      .eq('event_id', destinationEventId);

    if (existingError) {
      setErrorMessage('Não foi possível verificar as presenças do evento de destino.');
      setIsCopying(false);
      return;
    }

    const existingParticipantIds = new Set((existingRecords ?? []).map((record) => record.participant_id));
    const recordsToCopy = attendance
      .filter((record) => !existingParticipantIds.has(record.participant_id))
      .map((record) => ({
        event_id: destinationEventId,
        participant_id: record.participant_id,
      }));

    if (recordsToCopy.length > 0) {
      const { error: insertError } = await supabase.from('attendance').insert(recordsToCopy);
      if (insertError) {
        setErrorMessage('Não foi possível copiar as presenças para o evento.');
        setIsCopying(false);
        return;
      }
    }

    const skippedCount = attendance.length - recordsToCopy.length;
    setCopyMessage(
      recordsToCopy.length === 0
        ? 'Todas essas presenças já estavam registradas no evento escolhido.'
        : `${recordsToCopy.length} presença${recordsToCopy.length === 1 ? '' : 's'} copiada${recordsToCopy.length === 1 ? '' : 's'}${skippedCount > 0 ? ` · ${skippedCount} já existia${skippedCount === 1 ? '' : 'm'}` : ''}.`,
    );
    setIsCopying(false);
  };

  return (
    <section aria-labelledby="attendance-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Controle de presença</p>
          <div className="flex items-baseline gap-3">
            <h2 id="attendance-heading" className="text-2xl font-black text-white">Presentes</h2>
            <span className="text-3xl font-black text-green-400">{attendance.length}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Pessoas registradas neste evento</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <button
            type="button"
            onClick={handleOpenCopyPanel}
            className="rounded-lg border border-blue-400/40 px-4 py-2.5 text-sm font-bold text-blue-300 transition hover:bg-blue-400/10"
          >
            {isCopyPanelOpen ? 'Fechar cópia' : 'Copiar presença'}
          </button>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Buscar participante</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className="w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/70"
            />
          </label>
        </div>
      </div>

      {isCopyPanelOpen && (
        <div className="mt-6 rounded-xl border border-blue-400/25 bg-blue-400/[0.06] p-4 sm:p-5">
          <p className="font-bold text-white">Levar esta lista para outra palestra</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            As presenças serão registradas no novo evento sem apagar as atuais.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Evento de destino</span>
              <select
                value={copyTargetId}
                onChange={(event) => setCopyTargetId(event.target.value)}
                disabled={isLoadingTargets || isCopying}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/70 disabled:opacity-60"
              >
                <option value="">{isLoadingTargets ? 'Carregando eventos...' : 'Selecione o evento de destino'}</option>
                {targetEvents
                  .filter((event) => event.id !== eventId)
                  .map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} · {event.time_display}
                    </option>
                  ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleCopyAttendance}
              disabled={!copyTargetId || attendance.length === 0 || isCopying}
              className="rounded-lg bg-blue-400 px-5 py-3 text-sm font-black text-black transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCopying ? 'Copiando...' : 'Confirmar cópia'}
            </button>
          </div>
          {copyMessage && <p className="mt-3 text-sm font-semibold text-green-300">{copyMessage}</p>}
        </div>
      )}

      {errorMessage && <p className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{errorMessage}</p>}

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">Atualizando presença...</p>
        ) : filteredAttendance.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="font-semibold text-gray-300">{search ? 'Nenhum participante encontrado.' : 'Ainda não há presença registrada.'}</p>
            <p className="mt-1 text-sm text-gray-500">{search ? 'Tente outro nome ou e-mail.' : 'Os registros aparecerão aqui assim que forem lidos.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredAttendance.map((record) => {
              const participant = record.participants;
              return (
                <div key={record.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{participant?.name ?? 'Participante não encontrado'}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{participant?.email ?? 'E-mail indisponível'}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="text-xs font-medium text-gray-500">{formatCheckInTime(record.checked_in_at)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(record)}
                      disabled={removingId === record.id}
                      className="rounded-md border border-red-400/30 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-400/10 disabled:cursor-wait disabled:opacity-50"
                    >
                      {removingId === record.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && search && filteredAttendance.length > 0 && (
        <p className="mt-3 text-right text-xs text-gray-500">Exibindo {filteredAttendance.length} de {attendance.length}</p>
      )}
    </section>
  );
}