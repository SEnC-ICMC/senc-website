export const DEFAULT_ATTENDANCE_EVENT_TYPES = ['Palestra'];
export const ADMIN_ATTENDANCE_EVENT_TYPES = [...DEFAULT_ATTENDANCE_EVENT_TYPES, 'Networking'];

export function isNetworkingEventType(eventType: string) {
  return normalizeEventType(eventType) === 'networking';
}

export function normalizeEventType(eventType: string) {
  return eventType.trim().toLocaleLowerCase();
}

export function isAttendanceEventType(eventType: string, includedEventTypes: string[]) {
  const normalizedType = normalizeEventType(eventType);
  return includedEventTypes.some((includedType) => normalizeEventType(includedType) === normalizedType);
}
