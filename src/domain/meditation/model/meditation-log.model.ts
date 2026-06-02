export interface MeditationLogModel {
  id: string;
  userId: string;
  sessionDate: string;
  durationMinutes: number;
  concentrationLevel?: number | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
