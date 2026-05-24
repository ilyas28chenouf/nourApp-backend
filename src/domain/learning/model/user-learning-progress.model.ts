import { LearningProgressStatus } from '../enums/learning-progress-status.enum';
export interface UserLearningProgressModel { id: string; userId: string; learningItemId: string; status: LearningProgressStatus; progressPercent: number; lastReviewedAt?: Date | null; createdAt?: Date; updatedAt?: Date; }
