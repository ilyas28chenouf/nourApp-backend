export interface AsmaAlHusnaTranslationModel {
  id: string;
  nameId: string;
  language: 'ar' | 'fr' | 'en';
  translatedName: string;
  meaning: string;
  explanation: string;
  sourceName?: string | null;
  sourceReference?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AsmaAlHusnaModel {
  id: string;
  number: number;
  arabicName: string;
  transliteration: string;
  isActive: boolean;
  sortOrder: number;
  translations: AsmaAlHusnaTranslationModel[];
  createdAt: Date;
  updatedAt: Date;
}
