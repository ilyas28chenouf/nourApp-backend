import { DhikrPeriod } from '../enums/dhikr-period.enum';
export interface DhikrLogModel {
  id: string;
  userId: string;
  dhikrDate: string;
  period: DhikrPeriod;
  counter: number;
  completed: boolean;
  completedAt?: Date | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
