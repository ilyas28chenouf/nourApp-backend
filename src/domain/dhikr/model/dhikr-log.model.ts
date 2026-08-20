import { DhikrPeriod } from '../enums/dhikr-period.enum';
import { DhikrSessionType } from '../enums/dhikr-session-type.enum';
export interface DhikrLogModel {
  id: string;
  userId: string;
  dhikrDate: string;
  period: DhikrPeriod;
  dhikrItemId?: string | null;
  categoryId?: string | null;
  sessionType?: DhikrSessionType | null;
  counter: number;
  completed: boolean;
  completedAt?: Date | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
