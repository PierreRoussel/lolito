// src/app/models/pushup-record.ts
export interface PushupRecord {
  id?: string;
  deaths: number;
  isWin: boolean;
  hasPentakill: boolean;
  pentakillNumber: number;
  hasSurrender: boolean;
  surrenderingTeam?: 'blue' | 'red' | null;
  date: Date;
  pushupNumber?: number;
}
