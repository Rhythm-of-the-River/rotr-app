import type { Activity, Band, Timed } from '@/types';
import { getStartEnd } from './time';

export function applyTiming<T extends Band | Activity>(items: T[]): Timed<T>[] {
  return items.map((item) => ({
    ...item,
    ...getStartEnd(item.day, item.time)
  }));
}
