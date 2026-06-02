export interface CharityLogModel {
  id: string;
  userId: string;
  charityDate: string;
  amount?: string | number | null;
  currency: string;
  frequencyType?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
