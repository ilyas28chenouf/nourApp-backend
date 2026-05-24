import { ResourceType } from '../enums/resource-type.enum';
export interface ResourceModel { id: string; title: string; type: ResourceType; content?: string | null; audioUrl?: string | null; imageUrl?: string | null; language: string; category?: string | null; sourceName?: string | null; sourceUrl?: string | null; isActive: boolean; createdBy?: string | null; createdAt?: Date; updatedAt?: Date; }
