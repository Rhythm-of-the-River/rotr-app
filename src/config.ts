/**
 * App-wide configuration. Annual festival data (dates, year, timezone) lives
 * in `src/data/festival.json` so it sits alongside the other yearly data
 * (schedule, activities, food, bar, art).
 */
import festivalData from '@/data/festival.json';

interface FestivalConfig {
  name: string;
  year: number;
  /** YYYY-MM-DD */
  fridayDate: string;
  /** YYYY-MM-DD */
  saturdayDate: string;
  /** IANA time zone (e.g. "America/Chicago"). */
  timeZone: string;
}

export const FESTIVAL: FestivalConfig = festivalData;

export interface NavLink {
  label: string;
  to: string;
  external?: boolean;
  /**
   * Time-based visibility:
   *  - 'before-festival': only shown before the festival starts.
   *  - 'during-after':    only shown once the festival has started.
   *  - undefined:         always shown.
   */
  visibility?: 'before-festival' | 'during-after';
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Schedule', to: '/' },
  { label: 'Activities', to: '/activities' },
  { label: 'Food', to: '/food' },
  { label: 'Bar', to: '/bar' },
  { label: 'Art', to: '/art' },
  { label: 'Announcements', to: '/announcements' },
  {
    label: 'Volunteer',
    to: 'https://www.signupgenius.com/go/10C0944A8AC29A5F9C16-63598870-rhythm',
    external: true,
    visibility: 'before-festival'
  },
  {
    label: 'Survey',
    to: 'https://docs.google.com/forms/d/e/1FAIpQLSfQze8q8EXl383hEDfV_eSKSrn7FjxWetT59YCJL0GT3Y1eyg/viewform',
    external: true,
    visibility: 'during-after'
  }
];
