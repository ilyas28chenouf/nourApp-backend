import { QuranMemorizationStatus } from '../enums/quran-memorization-status.enum';

export interface QuranMemorizationProgressModel {
  id: string;
  userId: string;
  surahNumber: number;
  ayahFrom?: number | null;
  ayahTo?: number | null;
  status: QuranMemorizationStatus;
  lastReviewedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
