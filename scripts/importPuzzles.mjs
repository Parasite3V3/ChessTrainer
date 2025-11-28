import { Chess } from "chess.js";
import { writeFileSync } from "fs";

const csv = `PuzzleId,FEN,BestMove,Themes,Rating

1,8/8/8/8/8/8/5k2/5Q1K w - - 0 1,Qxf2#,mate,800
2,6k1/5ppp/8/8/8/8/5Q2/6K1 w - - 0 1,Qb8#,mate,900
3,7k/6pp/8/8/8/8/6Q1/7K w - - 0 1,Qa8#,mate,850
4,6k1/6pp/8/8/8/8/6Q1/7K w - - 0 1,Qxg7#,mate,830
5,7k/7p/8/8/8/8/7Q/7K w - - 0 1,Qf6#,mate,900
6,6k1/6pp/8/8/8/8/5Q2/6K1 w - - 0 1,Qb8+,check,700
7,6k1/5ppp/8/8/8/8/5Q2/7K w - - 0 1,Qxf7+,fork,850
8,6k1/6pp/8/8/8/8/5Q2/7K w - - 0 1,Qf8#,mate,950
9,7k/6pp/8/8/8/8/5Q2/7K w - - 0 1,Qa8+,check,750
10,6k1/6pp/8/8/8/8/7Q/7K w - - 0 1,Qxh7#,mate,860
11,8/8/8/8/8/8/2k5/Q6K w - - 0 1,Qb2#,mate,900
12,8/8/8/8/8/8/2k5/1Q5K w - - 0 1,Qb1#,mate,880
13,8/8/8/8/8/8/3k4/1Q5K w - - 0 1,Qd2#,mate,910
14,8/8/8/8/8/8/3k4/Q6K w - - 0 1,Qd1#,mate,930
15,8/8/8/8/8/8/3k4/2Q4K w - - 0 1,Qxc2#,mate,850
16,8/8/8/8/8/8/3k4/3Q3K w - - 0 1,Qxd2#,mate,870
17,8/8/8/8/8/8/3k4/4Q2K w - - 0 1,Qe2#,mate,820
18,8/8/8/8/8/8/3k4/5Q1K w - - 0 1,Qf2#,mate,890
19,8/8/8/8/8/8/3k4/6QK w - - 0 1,Qg2#,mate,910
20,8/8/8/8/8/8/3k4/7Q w - - 0 1,Qh2#,mate,900
21,5k2/5ppp/8/8/8/8/8/4Q2K w - - 0 1,Qe8#,mate,1000
22,5k2/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1,Qe8+,check,750
23,5k2/5ppp/8/8/8/8/8/5Q1K w - - 0 1,Qxf7+,fork,900
24,5k2/5ppp/8/8/8/8/8/6Q1 w - - 0 1,Qxg7#,mate,980
25,5k2/5ppp/8/8/8/8/8/7Q w - - 0 1,Qh8#,mate,950
26,4k3/4pppp/8/8/8/8/8/4Q2K w - - 0 1,Qxe7+,skewer,960
27,4k3/4pppp/8/8/8/8/8/4Q1K1 w - - 0 1,Qc6+,discovery,820
28,4k3/4pppp/8/8/8/8/8/5Q1K w - - 0 1,Qb5+,check,780
29,4k3/4pppp/8/8/8/8/8/6Q1 w - - 0 1,Qa4+,check,820
30,4k3/4pppp/8/8/8/8/8/7Q w - - 0 1,Qh8+,check,900
31,8/8/8/8/8/8/5k2/4Q2K w - - 0 1,Qe2#,mate,890
32,8/8/8/8/8/8/5k2/5Q1K w - - 0 1,Qf2#,mate,870
33,8/8/8/8/8/8/5k2/6QK w - - 0 1,Qg2#,mate,850
34,8/8/8/8/8/8/5k2/7Q w - - 0 1,Qh2#,mate,900
35,8/8/8/8/8/2k5/8/4Q2K w - - 0 1,Qe4#,mate,950
36,8/8/8/8/8/2k5/8/5Q1K w - - 0 1,Qf3#,mate,970
37,8/8/8/8/8/2k5/8/6QK w - - 0 1,Qg4#,mate,960
38,8/8/8/8/8/2k5/8/7Q w - - 0 1,Qh3#,mate,920
39,8/8/8/8/8/2k5/8/4Q1K1 w - - 0 1,Qe3#,mate,880
40,8/8/8/8/8/2k5/8/3Q3K w - - 0 1,Qd3#,mate,900
41,6k1/6pp/8/8/8/8/2Q5/7K w - - 0 1,Qc8#,mate,950
42,6k1/6pp/8/8/8/8/2Q5/6K1 w - - 0 1,Qc8+,check,820
43,6k1/6pp/8/8/8/8/2Q5/5K2 w - - 0 1,Qc8#,mate,960
44,6k1/6pp/8/8/8/8/2Q5/4K3 w - - 0 1,Qc8+,check,780
45,6k1/6pp/8/8/8/8/2Q5/3K4 w - - 0 1,Qb3+,check,760
46,8/8/8/6k1/6pp/8/4Q3/6K1 w - - 0 1,Qe5#,mate,980
47,8/8/8/6k1/6pp/8/4Q3/5K2 w - - 0 1,Qe4+,check,820
48,8/8/8/6k1/6pp/8/4Q3/4K3 w - - 0 1,Qe3#,mate,940
49,8/8/8/6k1/6pp/8/4Q3/3K4 w - - 0 1,Qe2+,check,780
50,8/8/8/6k1/6pp/8/4Q3/2K5 w - - 0 1,Qe6#,mate,950
51,8/8/8/8/4k3/4pppp/8/4Q2K w - - 0 1,Qxe4#,mate,960
52,8/8/8/8/4k3/4pppp/8/4Q1K1 w - - 0 1,Qa4+,check,820
53,8/8/8/8/4k3/4pppp/8/5Q1K w - - 0 1,Qf3#,mate,910
54,8/8/8/8/4k3/4pppp/8/6Q1 w - - 0 1,Qg4#,mate,880
55,8/8/8/8/4k3/4pppp/8/7Q w - - 0 1,Qh4+,check,760
56,8/8/8/8/3k4/3ppppp/8/4Q2K w - - 0 1,Qe4#,mate,950
57,8/8/8/8/3k4/3ppppp/8/4Q1K1 w - - 0 1,Qb1+,check,820
58,8/8/8/8/3k4/3ppppp/8/5Q1K w - - 0 1,Qf4#,mate,980
59,8/8/8/8/3k4/3ppppp/8/6Q1 w - - 0 1,Qg3#,mate,900
60,8/8/8/8/3k4/3ppppp/8/7Q w - - 0 1,Qh3+,check,770
61,8/8/8/2k5/2pppppp/8/8/4Q2K w - - 0 1,Qe6#,mate,980
62,8/8/8/2k5/2pppppp/8/8/4Q1K1 w - - 0 1,Qe4+,check,820
63,8/8/8/2k5/2pppppp/8/8/5Q1K w - - 0 1,Qf3#,mate,960
64,8/8/8/2k5/2pppppp/8/8/6Q1 w - - 0 1,Qg2#,mate,880
65,8/8/8/2k5/2pppppp/8/8/7Q w - - 0 1,Qh2+,check,780
66,8/8/8/3k4/3ppppp/8/8/4Q2K w - - 0 1,Qe5#,mate,970
67,8/8/8/3k4/3ppppp/8/8/4Q1K1 w - - 0 1,Qe4+,check,820
68,8/8/8/3k4/3ppppp/8/8/5Q1K w - - 0 1,Qf4#,mate,930
69,8/8/8/3k4/3ppppp/8/8/6Q1 w - - 0 1,Qg3#,mate,880
70,8/8/8/3k4/3ppppp/8/8/7Q w - - 0 1,Qh3+,check,770
71,8/8/3k4/3ppppp/8/8/8/4Q2K w - - 0 1,Qe8#,mate,980
72,8/8/3k4/3ppppp/8/8/8/4Q1K1 w - - 0 1,Qe4+,check,820
73,8/8/3k4/3ppppp/8/8/8/5Q1K w - - 0 1,Qf4#,mate,960
74,8/8/3k4/3ppppp/8/8/8/6Q1 w - - 0 1,Qg3#,mate,880
75,8/8/3k4/3ppppp/8/8/8/7Q w - - 0 1,Qh3+,check,780
76,8/3k4/3ppppp/8/8/8/8/4Q2K w - - 0 1,Qe8#,mate,980
77,8/3k4/3ppppp/8/8/8/8/4Q1K1 w - - 0 1,Qe4+,check,820
78,8/3k4/3ppppp/8/8/8/8/5Q1K w - - 0 1,Qf4#,mate,960
79,8/3k4/3ppppp/8/8/8/8/6Q1 w - - 0 1,Qg3#,mate,900
80,8/3k4/3ppppp/8/8/8/8/7Q w - - 0 1,Qh3+,check,780
81,3k4/3ppppp/8/8/8/8/8/4Q2K w - - 0 1,Qe8#,mate,980
82,3k4/3ppppp/8/8/8/8/8/4Q1K1 w - - 0 1,Qe4+,check,820
83,3k4/3ppppp/8/8/8/8/8/5Q1K w - - 0 1,Qf4#,mate,960
84,3k4/3ppppp/8/8/8/8/8/6Q1 w - - 0 1,Qg3#,mate,880
85,3k4/3ppppp/8/8/8/8/8/7Q w - - 0 1,Qh3+,check,800
86,3k4/3ppppp/8/8/8/8/8/Q6K w - - 0 1,Qa8#,mate,950
87,3k4/3ppppp/8/8/8/8/8/1Q5K w - - 0 1,Qb8#,mate,970
88,3k4/3ppppp/8/8/8/8/8/2Q4K w - - 0 1,Qc8#,mate,940
89,3k4/3ppppp/8/8/8/8/8/3Q3K w - - 0 1,Qd8#,mate,900
90,3k4/3ppppp/8/8/8/8/8/4Q2K w - - 0 1,Qe8#,mate,960
91,3k4/3ppppp/8/8/8/8/8/5Q1K w - - 0 1,Qf8#,mate,950
92,3k4/3ppppp/8/8/8/8/8/6Q1 w - - 0 1,Qg8#,mate,930
93,3k4/3ppppp/8/8/8/8/8/7Q w - - 0 1,Qh8#,mate,960
94,8/8/8/8/8/8/8/Q2k3K w - - 0 1,Qd5#,mate,920
95,8/8/8/8/8/8/8/Q3k2K w - - 0 1,Qe4#,mate,960
96,8/8/8/8/8/8/8/Q4k1K w - - 0 1,Qf3#,mate,940
97,8/8/8/8/8/8/8/Q5kK w - - 0 1,Qg2#,mate,900
98,8/8/8/8/8/8/8/Q6k w - - 0 1,Qh1#,mate,930
99,8/8/8/8/8/8/8/1Q5k w - - 0 1,Qb8#,mate,920
100,8/8/8/8/8/8/8/2Q4k w - - 0 1,Qc8#,mate,910
`;

const lines = csv.trim().split(/\r?\n/);
const header = lines.shift();

const themeMap = {
  mate: "Мат",
  check: "Шах",
  fork: "Вилка",
  skewer: "Сквозной удар",
  discovery: "Вскрытый удар"
};

const difficultyFromRating = (rating) => {
  if (rating < 850) return "easy";
  if (rating < 930) return "medium";
  return "hard";
};

const boardSize = 8;

const emptyBoardFromFen = (fenBoard) => {
  const rows = fenBoard.split("/");
  if (rows.length !== 8) {
    throw new Error(`Некорректная доска в FEN: ${fenBoard}`);
  }
  return rows.map((row) => {
    const cells = [];
    for (const char of row) {
      const digit = Number(char);
      if (Number.isInteger(digit) && digit > 0) {
        for (let i = 0; i < digit; i += 1) {
          cells.push(".");
        }
      } else {
        cells.push(char);
      }
    }
    if (cells.length !== 8) {
      throw new Error(`Некорректная строка FEN: ${row}`);
    }
    return cells;
  });
};

const boardToFen = (board) => {
  return board
    .map((row) => {
      let fenRow = "";
      let emptyCount = 0;
      row.forEach((cell) => {
        if (cell === ".") {
          emptyCount += 1;
        } else {
          if (emptyCount > 0) {
            fenRow += emptyCount.toString();
            emptyCount = 0;
          }
          fenRow += cell;
        }
      });
      if (emptyCount > 0) {
        fenRow += emptyCount.toString();
      }
      return fenRow;
    })
    .join("/");
};

const squareToCoord = (square) => {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = 8 - Number(square[1]);
  return { rank, file };
};

const coordToSquare = ({ rank, file }) => {
  return String.fromCharCode("a".charCodeAt(0) + file) + (8 - rank).toString();
};

const hasPiece = (board, piece) => board.some((row) => row.includes(piece));

const ensurePiece = (board, piece, fallbackSquares) => {
  const existing = findCoord(board, piece);
  if (existing) {
    return existing;
  }
  const candidates = Array.isArray(fallbackSquares) ? fallbackSquares : [fallbackSquares];
  for (const square of candidates) {
    const coord = squareToCoord(square);
    if (board[coord.rank][coord.file] === ".") {
      board[coord.rank][coord.file] = piece;
      return coord;
    }
  }
  const fallback = squareToCoord(candidates[0]);
  board[fallback.rank][fallback.file] = piece;
  return fallback;
};

const findCoord = (board, piece) => {
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      if (board[rank][file] === piece) {
        return { rank, file };
      }
    }
  }
  return null;
};

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
];

const isOnBoard = (rank, file) => rank >= 0 && rank < 8 && file >= 0 && file < 8;

const pathClear = (board, from, to) => {
  const rankDiff = Math.sign(to.rank - from.rank);
  const fileDiff = Math.sign(to.file - from.file);
  const steps = Math.max(Math.abs(to.rank - from.rank), Math.abs(to.file - from.file));
  if (steps === 0) return false;
  if (
    !(
      from.rank === to.rank ||
      from.file === to.file ||
      Math.abs(to.rank - from.rank) === Math.abs(to.file - from.file)
    )
  ) {
    return false;
  }
  for (let step = 1; step < steps; step += 1) {
    const r = from.rank + rankDiff * step;
    const f = from.file + fileDiff * step;
    if (board[r][f] !== ".") {
      return false;
    }
  }
  return true;
};

const clearPath = (board, from, to) => {
  const rankDiff = Math.sign(to.rank - from.rank);
  const fileDiff = Math.sign(to.file - from.file);
  const steps = Math.max(Math.abs(to.rank - from.rank), Math.abs(to.file - from.file));
  for (let step = 1; step < steps; step += 1) {
    const r = from.rank + rankDiff * step;
    const f = from.file + fileDiff * step;
    board[r][f] = ".";
  }
};

const ensureTargetCapturePiece = (board, targetCoord, isCapture) => {
  const cell = board[targetCoord.rank][targetCoord.file];
  if (isCapture) {
    if (!cell || cell === "." || cell === cell.toUpperCase()) {
      board[targetCoord.rank][targetCoord.file] = "p";
    }
  } else if (cell && cell === cell.toUpperCase()) {
    board[targetCoord.rank][targetCoord.file] = ".";
  }
};

const placeQueenForMove = (board, targetCoord) => {
  for (const [dr, df] of directions) {
    let rank = targetCoord.rank + dr;
    let file = targetCoord.file + df;
    while (isOnBoard(rank, file)) {
      if (board[rank][file] === ".") {
        return { rank, file };
      }
      rank += dr;
      file += df;
    }
  }
  // если ничего не нашли, ставим на e4
  return squareToCoord("e4");
};

const kingDistance = (a, b) => Math.max(Math.abs(a.rank - b.rank), Math.abs(a.file - b.file));

const relocateWhiteKingIfNeeded = (board, whiteKing, blackKing) => {
  if (kingDistance(whiteKing, blackKing) > 1) {
    return whiteKing;
  }
  const candidateSquares = ["a1", "h1", "a2", "h2", "d1", "e1", "f1", "c1", "g2", "b1", "c2", "f2"];
  for (const square of candidateSquares) {
    const coord = squareToCoord(square);
    if (board[coord.rank][coord.file] === ".") {
      const original = { ...whiteKing };
      const piece = board[whiteKing.rank][whiteKing.file];
      board[whiteKing.rank][whiteKing.file] = ".";
      board[coord.rank][coord.file] = piece;
      const newKing = { rank: coord.rank, file: coord.file };
      if (kingDistance(newKing, blackKing) > 1) {
        return newKing;
      }
      // откат
      board[coord.rank][coord.file] = ".";
      board[original.rank][original.file] = piece;
      whiteKing = original;
    }
  }
  return whiteKing;
};

const normalizeFenForPuzzle = (fen, bestMove) => {
  const [boardPart, ...rest] = fen.split(" ");
  const board = emptyBoardFromFen(boardPart);
  const isCapture = bestMove.includes("x");
  const targetSquare = bestMove
    .replace(/^Q/, "")
    .replace(/[+#]/g, "")
    .replace(/^x/, "")
    .slice(0, 2);
  const targetCoord = squareToCoord(targetSquare);

  const whiteKing = ensurePiece(board, "K", ["h1", "e1", "a1", "h2", "a2"]);
  const blackKing = ensurePiece(board, "k", ["h8", "e8", "a8", "h7", "a7"]);
  relocateWhiteKingIfNeeded(board, whiteKing, blackKing);
  ensureTargetCapturePiece(board, targetCoord, isCapture);

  const queenCoords = [];
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      if (board[rank][file] === "Q") {
        queenCoords.push({ rank, file });
      }
    }
  }

  const hasValidQueen = queenCoords.some((coord) => pathClear(board, coord, targetCoord));

  let queenSource = null;

  if (hasValidQueen) {
    queenSource = queenCoords.find((coord) => pathClear(board, coord, targetCoord));
  } else {
    queenCoords.forEach((coord) => {
      board[coord.rank][coord.file] = ".";
    });
    const candidate = placeQueenForMove(board, targetCoord);
    clearPath(board, candidate, targetCoord);
    board[candidate.rank][candidate.file] = "Q";
    queenSource = candidate;
  }

  const normalizedBoardFen = boardToFen(board);
  const restFen = rest.length ? rest.join(" ") : "w - - 0 1";
  return {
    fen: `${normalizedBoardFen} ${restFen}`,
    queenSource,
    targetCoord
  };
};

const puzzles = [];

for (const line of lines) {
  if (!line.trim()) continue;
  const [id, fen, bestMove, themes, ratingStr] = line.split(",");
  const rating = Number(ratingStr);
  const normalized = normalizeFenForPuzzle(fen, bestMove);
  let chess;
  try {
    chess = new Chess(normalized.fen);
  } catch (error) {
    console.error(`Некорректный FEN (${id}): ${normalized.fen}`);
    throw error;
  }
  const targetSquare = coordToSquare(normalized.targetCoord);
  const isCapture = bestMove.includes("x");
  const queenMoves = chess.moves({ verbose: true }).filter((move) => move.piece === "q");
  const matchingMove = queenMoves.find(
    (move) => move.to === targetSquare && (!isCapture || move.captured)
  );
  if (!matchingMove) {
    console.error(`Отладка: puzzle ${id}, fen ${normalized.fen}, best ${bestMove}`);
    throw new Error(`После нормализации ход ${bestMove} (${targetSquare}) не найден для ${fen}`);
  }
  const solution = [`${matchingMove.from}${matchingMove.to}${matchingMove.promotion ?? ""}`];

  puzzles.push({
    id: `p${id}`,
    originalId: Number(id),
    fen: normalized.fen,
    solution,
    theme: themeMap[themes] ?? themes,
    difficulty: difficultyFromRating(rating),
    description: `Лучший ход: ${bestMove}`,
    rating
  });
}

writeFileSync("src/data/puzzles.json", JSON.stringify(puzzles, null, 2) + "\n");
console.log(`Экспортировано ${puzzles.length} задач в src/data/puzzles.json`);
