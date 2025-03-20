export interface Deck {
  id: string;
  title: string;
  cardCount: number;
  userId: string; // Tied to authenticated user
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  userId: string;
}

export const decks: Deck[] = [
  { id: "1", title: "Spanish Basics", cardCount: 2, userId: "user1" },
  { id: "2", title: "French Verbs", cardCount: 1, userId: "user1" },
];

export const cards: Card[] = [
  { id: "1", deckId: "1", front: "Hola", back: "Hello", userId: "user1" },
  { id: "2", deckId: "1", front: "Adiós", back: "Goodbye", userId: "user1" },
  { id: "3", deckId: "2", front: "Manger", back: "To eat", userId: "user1" },
];
