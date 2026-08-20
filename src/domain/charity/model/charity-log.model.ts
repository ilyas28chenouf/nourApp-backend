import { CharityActionType } from '../enums/charity-action-type.enum';

export interface CharityLogModel {
  id: string;
  userId: string;
  charityDate: string;
  amount?: string | number | null;
  currency: string;
  frequencyType?: string | null;
  actionType: CharityActionType;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
