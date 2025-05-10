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