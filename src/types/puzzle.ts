export type Difficulty = "easy" | "medium" | "hard";

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  theme: string;
  difficulty: Difficulty;
  description?: string;
  sideToMove?: "white" | "black";
  hint?: string;
  rating?: number;
  originalId?: number;
}

