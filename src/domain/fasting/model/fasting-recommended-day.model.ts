import { FastingType } from '../enums/fasting-type.enum';
export interface FastingRecommendedDayModel {
  id: string;
  date: string;
  hijriDate?: string | null;
  type: FastingType;
  title: string;
  description?: string | null;
  createdAt?: Date;
}
