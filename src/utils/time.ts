import { FESTIVAL } from '@/config';
import type { Day } from '@/types';

/** Returns the date string (YYYY-MM-DD) for a given festival day. */
export function dateForDay(day: Day): string {
  return day === 'F' ? FESTIVAL.fridayDate : FESTIVAL.saturdayDate;
}

/**
 * Compute the UTC offset (e.g. "-0500") for the festival timezone on a given
 * date. Uses Intl APIs so it works in all browsers without extra deps.
 */
function tzOffset(dateStr: string): string {
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: FESTIVAL.timeZone,
    timeZoneName: 'longOffset'
  });
  const parts = formatter.formatToParts(probe);
  const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  // tzName looks like "GMT-05:00" - convert to "-0500"
  const match = tzName.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return '+0000';
  return `${match[1]}${match[2]}${match[3]}`;
}

/** Parses "5:00pm" / "11:45am" plus a date into epoch seconds. */
export function parseTime(date: string, time: string): number {
  const cleaned = time.trim().toLowerCase();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (!match) {
    throw new Error(`Invalid time format: "${time}"`);
  }
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3];
  if (meridiem === 'pm' && hour !== 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  const offset = tzOffset(date);
  const iso = `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00${offset.slice(0, 3)}:${offset.slice(3)}`;
  return Math.floor(new Date(iso).getTime() / 1000);
}

/**
 * Splits a time range like "5:00pm - 6:00pm" or single "4:55pm" into
 * { start, end } epoch seconds for the given festival day.
 */
export function getStartEnd(day: Day, timeRange: string): { start: number; end: number } {
  const date = dateForDay(day);
  const parts = timeRange.split(' - ').map((p) => p.trim());
  const start = parseTime(date, parts[0]);
  const end = parts[1] ? parseTime(date, parts[1]) : start;
  return { start, end };
}

/** Festival start = first set on Friday. */
export function festivalStart(firstFridayTime: string): number {
  const start = firstFridayTime.split(' - ')[0];
  return parseTime(FESTIVAL.fridayDate, start);
}

/** Festival end = last set on Saturday. */
export function festivalEnd(lastSaturdayTime: string): number {
  const parts = lastSaturdayTime.split(' - ');
  return parseTime(FESTIVAL.saturdayDate, parts[parts.length - 1]);
}

export function formatRelative(seconds: number): string {
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function formatClock(epochSeconds: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: FESTIVAL.timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(epochSeconds * 1000));
}
