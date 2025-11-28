import { Chess } from "chess.js";
import { writeFileSync } from "fs";

const rawPuzzles = [
  { id: 1, fen: "6k1/5ppp/8/8/8/8/5Q2/6K1 w - - 0 1", theme: "Мат в 1 ход", san: ["Qxf7#"] },
  { id: 2, fen: "7k/6pp/6Q1/8/8/8/8/7K w - - 0 1", theme: "Мат в 1 ход", san: ["Qg8#"] },
  { id: 3, fen: "6k1/6pp/8/8/8/8/6Q1/7K w - - 0 1", theme: "Мат в 1 ход", san: ["Qa8#"] },
  { id: 4, fen: "6k1/5ppp/8/8/8/8/7Q/7K w - - 0 1", theme: "Мат в 1 ход", san: ["Qxh7#"] },
  { id: 5, fen: "7k/5ppp/8/8/8/8/3Q4/6K1 w - - 0 1", theme: "Мат в 1 ход", san: ["Qd8#"] },
  { id: 6, fen: "7k/5ppp/8/8/8/8/2Q5/6K1 w - - 0 1", theme: "Мат в 1 ход", san: ["Qc8#"] },
  { id: 7, fen: "7k/5ppp/8/8/8/8/4Q3/6K1 w - - 0 1", theme: "Мат в 1 ход", san: ["Qe8#"] },
  { id: 8, fen: "7k/5ppp/8/8/8/8/5Q2/5K2 w - - 0 1", theme: "Мат в 1 ход", san: ["Qxf7#"] },
  { id: 9, fen: "4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1", theme: "Мат ладьёй", san: ["Rxe8#"] }
];

const convertSanToUci = (fen, sanMoves) => {
  const chess = new Chess(fen);
  return sanMoves.map((san) => {
    const move = chess.move(san, { sloppy: true });
    if (!move) {
      throw new Error(`Ход ${san} невозможен в позиции ${fen}`);
    }
    return `${move.from}${move.to}${move.promotion ?? ""}`;
  });
};

const puzzles = rawPuzzles.map((puzzle) => ({
  id: `p${puzzle.id}`,
  originalId: puzzle.id,
  fen: puzzle.fen,
  theme: puzzle.theme,
  difficulty: "easy",
  description: puzzle.theme,
  sideToMove: "white",
  solution: convertSanToUci(puzzle.fen, puzzle.san)
}));

writeFileSync("src/data/puzzles.json", JSON.stringify(puzzles, null, 2) + "\n");
console.log(`Добавлено ${puzzles.length} задач в src/data/puzzles.json`);
