// interfaces.ts
export interface Card {
  id: string;
  content: string;
  nextReviewDate: Date;
  interval: number;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}
