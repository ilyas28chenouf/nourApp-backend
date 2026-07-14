export interface HadithCollectionModel {
  id: string;
  key: string;
  name: string;
  arabicName: string;
  author: string;
  reliability?: string | null;
  description?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  totalHadiths?: number;
  createdAt: Date;
  updatedAt: Date;
}
