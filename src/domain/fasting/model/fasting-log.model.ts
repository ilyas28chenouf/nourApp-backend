import { FastingStatus } from '../enums/fasting-status.enum';
import { FastingType } from '../enums/fasting-type.enum';
export interface FastingLogModel {
  id: string;
  userId: string;
  fastingDate: string;
  fastingType: FastingType;
  status: FastingStatus;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
