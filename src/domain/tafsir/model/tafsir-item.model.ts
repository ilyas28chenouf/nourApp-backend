export interface TafsirItemModel {
  id: string;
  collectionId: string;
  surahNumber: number;
  ayahNumber: number;
  surahName?: string | null;
  title?: string | null;
  content: string;
  sourceReference?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
