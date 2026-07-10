export type Day = 'F' | 'S';

export interface Band {
  name: string;
  day: Day;
  time: string;
  stage: 'Main' | 'Church';
  bio?: string;
  img?: string;
  web?: string;
  fb?: string;
  insta?: string;
  spotify?: string;
  apple?: string;
  yt?: string;
}

export interface Activity {
  name: string;
  day: Day;
  time: string;
  location: string;
}

export interface ScheduleData {
  friday: Band[];
  saturday: Band[];
}

export interface ActivitiesData {
  friday: Activity[];
  saturday: Activity[];
}

export interface MenuOption {
  option: string;
  price?: string;
}

export interface MenuItem {
  item?: string;
  section?: string;
  desc?: string;
  price?: string;
  options?: MenuOption[];
}

export interface FoodVendor {
  vendor: string;
  subtitle?: string;
  note?: string;
  menu: MenuItem[];
}

export interface ArtVendor {
  vendor: string;
  description: string;
}

export interface BarMenuItem {
  item: string;
  desc?: string;
  price?: string;
}

export interface BarSection {
  name: string;
  subtitle?: string;
  items: BarMenuItem[];
}

export interface BarData {
  vendor: string;
  sections?: BarSection[];
}

export interface Announcement {
  id: string;
  time: number;
  user: string;
  name?: string;
  subject: string;
  message: string;
}

/** Band/Activity with computed start/end epoch seconds for the festival date. */
export type Timed<T> = T & { start: number; end: number };
