// app/interfaces.ts
export interface CardDto {
  id: string;
  front: string;
  back: string;
  hint?: string;
  mediaUrl?: string;
  skill: string;
  deckId: string;
  creatorId: string;
  createdDate: string;
  progress?: UserCardProgressDto;
}

export interface UserCardProgressDto {
  id: string;
  userId: string;
  cardId: string;
  repetitions: number;
  interval: number;
  easiness: number;
  nextReviewDate: string;
  lastReviewedDate?: string;
  lastQuality: number;
  stability: number;
  difficulty: number;
  lapses: number;
  state: string;
  skill: SkillType;
}

export interface ReviewResponseDto {
  card: CardDto;
  feedback: ReviewFeedbackDto;
}

export interface ReviewFeedbackDto {
  nextReviewDate: string;
  interval: number;
  message: string;
}

export interface StudySessionCardDto {
  cardId: string;
  front: string;
  back: string;
  quality: number;
  reviewedAt: string;
}

export interface StudySessionDto {
  id: string;
  startTime: string;
  endTime?: string;
  reviewedCards: StudySessionCardDto[];
  averageQuality: number;
  totalCardsReviewed: number;
}

export interface StartSessionResponse {
  sessionId: string;
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
  preferredMode: string;
}

export interface StartSessionResponse {
  sessionId: string;
}

export interface StudySessionCardDto {
  cardId: string;
  front: string;
  back: string;
  quality: number;
  reviewedAt: string;
}

export interface StudySessionDto {
  id: string;
  startTime: string;
  endTime?: string;
  reviewedCards: StudySessionCardDto[];
  averageQuality: number;
  totalCardsReviewed: number;
}

///
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
  authorNickname?: string;
  authorAvatar?: string;
  generationPrompt?: string;
  llmModel?: string;
}

export type SkillType = "Reading" | "Writing" | "Speaking" | "Listening";

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

export interface UpdateUserSettingsRequestDto {
  dailyNewCardLimit: number;
  dailyReviewLimit: number;
  rolloverHour: number;
  preferredMode: LearningMode;
}

export interface CardTableRow {
  id: string;
  front: string;
  back: string;
  hint: string | null;
  deckTitle: string;
  deckId: string;
  createdDate: string;
  nextReviewDate: string | null;
  interval: number;
  easiness: number;
  repetitions: number;
}
