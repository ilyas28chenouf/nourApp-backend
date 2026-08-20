export interface TafsirProgressModel {
  id: string;
  userId: string;
  collectionId: string;
  surahNumber: number;
  ayahNumber: number;
  readDate: string;
  completed: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
