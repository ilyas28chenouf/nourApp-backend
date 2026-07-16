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

export interface TafsirPublicListItemModel {
  surahNumber: number;
  ayahNumber: number;
  surahName?: string | null;
  title?: string | null;
  sourceReference?: string | null;
}
