export interface HadithItemModel {
  id: string;
  collectionId: string;
  hadithNumber: number;
  arabic: string;
  english?: string | null;
  french?: string | null;
  grade?: string | null;
  narrator?: string | null;
  chapter?: string | null;
  sourceReference?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HadithPublicListItemModel {
  hadithNumber: number;
  grade?: string | null;
  narrator?: string | null;
  chapter?: string | null;
  sourceReference?: string | null;
}
