import { LearningItemType } from '../enums/learning-item-type.enum';
export interface LearningItemModel {
  id: string;
  title: string;
  type: LearningItemType;
  content: string;
  explanation?: string | null;
  audioUrl?: string | null;
  difficulty?: string | null;
  language: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
