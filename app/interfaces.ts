// interfaces.ts
export interface Card {
  id: string;
  text: string;
  transcription: string;
  meaning: string;
  example: string;
  image: string;
  deckId: string;
}
export interface Deck{
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  groupId: string;
}


// Type definitions for common API responses
export interface ApiError {
  error: string;
  status?: number; // For status code access
  details?: Record<string, any>;
}

export interface DeckResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  ownerId: string;
  createdDate: string;
  lastReviewedDate?: string;
  tags: string[];
  cardCount: number;
  subscriberCount: number;
  isSubscribed: boolean;
  averageDifficulty: number;
  authorNickname?: string; // New
  authorAvatar?: string; // New
  generationPrompt?: string; // New
  llmModel?: string; // New
}

export interface CardDto {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  mediaUrl?: string;
  skill: SkillType;
  createdDate: string; // Added
  progress?: UserCardProgressDto; // Added
}

export type SkillType = "Reading" | "Writing" | "Speaking" | "Listening";

export interface UserCardProgressDto {
  interval: number;
  easiness: number;
  repetitions: number;
  nextReviewDate?: string;
}

export interface UserCardProgress {
  id: string;
  repetitions: number;
  interval: number;
  easiness: number;
  nextReviewDate: string;
  lastReviewedDate?: string;
  lastQuality: number;
}

// Types for settings
export enum LearningMode {
  Learn = "Learn",
  Review = "Review",
  Cram = "Cram",
}

export interface UserSettingsDto {
  id: string;
  userId: string;
  dailyNewCardLimit: number;
  dailyReviewLimit: number;
  newCardsCompletedToday: number;
  reviewsCompletedToday: number;
  rolloverHour: number;
  lastResetDate: string;
  preferredMode: LearningMode;
}

export interface UpdateUserSettingsRequestDto {
  dailyNewCardLimit: number;
  dailyReviewLimit: number;
  rolloverHour: number;
  preferredMode: LearningMode;
}




export interface StartSessionResponse {
  sessionId: string;
}

export interface SessionDetails {
  id: string;
  startTime: string; // ISO 8601 format
  endTime: string | null; // ISO 8601 format
  reviewedCards: Array<{
    cardId: string;
    quality: number; // 0-5
    reviewedAt: string; // ISO 8601 format
  }>;
  averageQuality: number;
  totalCardsReviewed: number;
}

export interface ReviewFeedbackDto {
  nextReviewDate: string;
  interval: number;
  message: string;
}

export interface ReviewResponseDto {
  card: CardDto;
  feedback: ReviewFeedbackDto;
}