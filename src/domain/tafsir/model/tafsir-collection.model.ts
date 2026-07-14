export interface TafsirCollectionModel {
  id: string;
  key: string;
  name: string;
  arabicName?: string | null;
  author: string;
  language: string;
  description?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  totalTafsirs?: number;
  createdAt: Date;
  updatedAt: Date;
}
