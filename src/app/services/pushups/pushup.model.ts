// src/app/models/pushup-record.ts
export interface PushupRecord {
  id?: string;
  deaths: number;
  isWin: boolean;
  hasPentakill: boolean;
  pentakillNumber: number;
  hasSurrender: boolean;
  date: Date;
  pushupNumber?: number;
  player?: string;
  created_at?: string;
}
