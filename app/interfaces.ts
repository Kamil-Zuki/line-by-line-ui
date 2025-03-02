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
