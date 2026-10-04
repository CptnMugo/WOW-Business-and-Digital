export const callTimes = Array.from({ length: 12 }, (_, i) => `${String(11 + Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`);
export const sessions = [
 ...['2026-10-10', '2026-10-16'].map(date => ({ id: `taster:${date}:10:00`, kind: 'taster', date, time: '10:00', label: `${date === '2026-10-10' ? 'Saturday 10' : 'Friday 16'} October 2026, 10am to 2pm` })),
 ...['2026-10-08', '2026-10-09'].flatMap(date => callTimes.map(time => ({ id: `call:${date}:${time}`, kind: 'call', date, time, label: `${date === '2026-10-08' ? 'Thursday 8' : 'Friday 9'} October 2026, ${time} (15 minutes)` }))),
];
export const sessionOpen = (s: typeof sessions[number], now = Date.now()) => new Date(`${s.date}T${s.time}:00+01:00`).getTime() > now;
