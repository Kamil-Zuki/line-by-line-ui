export interface CardTableRow {
    id: string;
    front: string;
    back: string;
    hint: string | null;
    deckName: string;
    createdDate: string;
    nextReviewDate: string | null;
    interval: number;
    easiness: number;
    repetitions: number;
  }