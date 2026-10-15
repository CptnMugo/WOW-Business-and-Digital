export const callTimes: string[] = [];
export const sessions = [
 { id: 'taster:2026-11-28:10:00', kind: 'taster', date: '2026-11-28', time: '10:00', startsAt: '2026-11-28T10:00:00Z', label: 'Saturday 28 November 2026, 10am to 2pm UK time (GMT)' },
];
export const sessionOpen = (s: typeof sessions[number], now = Date.now()) => Date.parse(s.startsAt) > now;
