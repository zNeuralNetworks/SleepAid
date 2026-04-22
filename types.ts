export interface SleepStat {
  day: string;
  hours: number;
  quality: number; // 1-10
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ROADMAP = 'ROADMAP',
  BREATHE = 'BREATHE',
  STORY = 'STORY'
}
