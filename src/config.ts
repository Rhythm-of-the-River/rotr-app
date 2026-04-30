/**
 * Centralized festival configuration.
 * Update these dates each year to roll the schedule forward.
 */
export const FESTIVAL = {
  name: 'Rhythm of the River',
  year: 2026,
  fridayDate: '2026-07-10',
  saturdayDate: '2026-07-11',
  /** Time zone where the festival occurs (used for parsing time strings). */
  timeZone: 'America/Chicago'
} as const;

export const NAV_LINKS: { label: string; to: string; external?: boolean }[] = [
  { label: 'Schedule', to: '/' },
  { label: 'Activities', to: '/activities' },
  { label: 'Food', to: '/food' },
  { label: 'Bar', to: '/bar' },
  { label: 'Art', to: '/art' },
  { label: 'Announcements', to: '/announcements' },
  {
    label: 'Volunteer',
    to: 'https://www.signupgenius.com/go/10C0944A8AC29A5F9C16-56668585-rhythm?useFullSite=true#/',
    external: true
  },
  {
    label: 'Survey',
    to: 'https://docs.google.com/forms/d/e/1FAIpQLSfJk8QrLR7rRrqBstlCVw6CqGKKol7OIfiQcMVCOLXR54Qx7A/viewform?usp=header',
    external: true
  }
];

export const PRIVACY_URL =
  'https://storage.googleapis.com/rotr-app-assets/privacy.html';
