import { QuranMemorizationStatus } from '../enums/quran-memorization-status.enum';
import { QuranMemorizationUnit } from '../enums/quran-memorization-unit.enum';

export interface QuranMemorizationProgressModel {
  id: string;
  userId: string;
  surahNumber: number;
  ayahFrom?: number | null;
  ayahTo?: number | null;
  memorizationDate?: string | null;
  selectionUnit?: QuranMemorizationUnit | null;
  selectionValue?: number | string | null;
  status: QuranMemorizationStatus;
  completedAt?: Date | null;
  lastReviewedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
