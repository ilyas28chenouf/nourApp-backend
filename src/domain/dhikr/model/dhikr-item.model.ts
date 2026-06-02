import { DhikrCategory } from '../enums/dhikr-category.enum';
export interface DhikrItemModel {
  id: string;
  title: string;
  arabicText: string;
  translation?: string | null;
  transliteration?: string | null;
  category: DhikrCategory;
  recommendedCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
