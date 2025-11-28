import { useCallback, useMemo, useRef, useState } from "react";
import { Chess, ShortMove, Move } from "chess.js";
import puzzles from "../data/puzzles.json";
import { Puzzle } from "../types/puzzle";

type TrainerMode = "puzzle" | "free";

export type TrainerStatus = "idle" | "in_progress" | "solved" | "failed" | "free_play";

interface TrainerStats {
  solved: number;
  failed: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeMs: number;
}

const initialStats: TrainerStats = {
  solved: 0,
  failed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalTimeMs: 0
};

const parsedPuzzles = puzzles as Puzzle[];

const moveToUci = (move: Move) => `${move.from}${move.to}${move.promotion ?? ""}`;

const uciToShortMove = (uci: string): ShortMove => ({
  from: uci.slice(0, 2),
  to: uci.slice(2, 4),
  promotion: uci.length === 5 ? (uci.slice(4) as ShortMove["promotion"]) : undefined
});

export const usePuzzleTrainer = () => {
  const [mode, setMode] = useState<TrainerMode>("puzzle");
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [status, setStatus] = useState<TrainerStatus>("idle");
  const [message, setMessage] = useState("Выберите режим и начните тренировку");
  const [boardFen, setBoardFen] = useState("start");
  const [stats, setStats] = useState<TrainerStats>(initialStats);
  const [hintVisible, setHintVisible] = useState(false);

  const [kingInCheckSquare, setKingInCheckSquare] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [freePlayResult, setFreePlayResult] = useState<{ winner: "white" | "black"; message: string } | null>(null);

  const engineRef = useRef(new Chess());
  const moveIndexRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const boardOrientation = mode === "free" ? playerColor : currentPuzzle?.sideToMove ?? "white";

  const averageTime = useMemo(() => {
    if (stats.solved === 0) {
      return 0;
    }
    return Math.round(stats.totalTimeMs / stats.solved / 1000);
  }, [stats]);

  const findKingSquare = useCallback((color: "w" | "b") => {
    const board = engineRef.current.board();
    for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
        const piece = board[rankIndex][fileIndex];
        if (piece && piece.type === "k" && piece.color === color) {
          const fileChar = String.fromCharCode("a".charCodeAt(0) + fileIndex);
          const rankChar = (8 - rankIndex).toString();
          return `${fileChar}${rankChar}`;
        }
      }
    }
    return null;
  }, []);

  const refreshBoardState = useCallback(() => {
    setBoardFen(engineRef.current.fen());
    if (engineRef.current.in_check()) {
      const checkedColor = engineRef.current.turn();
      setKingInCheckSquare(findKingSquare(checkedColor));
    } else {
      setKingInCheckSquare(null);
    }
    if (mode === "free" && engineRef.current.in_checkmate()) {
      const loser = engineRef.current.turn();
      setFreePlayResult({
        winner: loser === "w" ? "white" : "black",
        message: loser === "w" ? "Белые получили мат." : "Чёрные получили мат."
      });
    }
  }, [findKingSquare, mode]);

  const loadPuzzle = useCallback((puzzle: Puzzle) => {
    try {
      engineRef.current = new Chess(puzzle.fen);
      moveIndexRef.current = 0;
      startTimeRef.current = performance.now();

      setCurrentPuzzle(puzzle);
      setBoardFen(puzzle.fen);
      setStatus("in_progress");
      setMessage("Найдите тактическое решение.");
      setHintVisible(false);
      setKingInCheckSquare(null);
    } catch (error) {
      console.error("Ошибка загрузки задачи:", error, puzzle);
      setCurrentPuzzle(puzzle);
      setBoardFen(puzzle.fen);
      setStatus("in_progress");
      setMessage("Найдите тактическое решение.");
      setHintVisible(false);
      setKingInCheckSquare(null);
    }
  }, []);

  const loadRandomPuzzle = useCallback(() => {
    const randomPuzzle = parsedPuzzles[Math.floor(Math.random() * parsedPuzzles.length)];
    setMode("puzzle");
    loadPuzzle(randomPuzzle);
  }, [loadPuzzle]);

  const loadPuzzleById = useCallback(
    (id: string) => {
      const found = parsedPuzzles.find((item) => item.id === id);
      if (!found) {
        return false;
      }
      setMode("puzzle");
      loadPuzzle(found);
      return true;
    },
    [loadPuzzle]
  );

  const updateStats = useCallback(
    (result: "solved" | "failed") => {
      setStats((prev) => {
        const now = performance.now();
        const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
        const solved = result === "solved" ? prev.solved + 1 : prev.solved;
        const failed = result === "failed" ? prev.failed + 1 : prev.failed;
        const currentStreak =
          result === "solved" ? prev.currentStreak + 1 : 0;
        const bestStreak = Math.max(prev.bestStreak, currentStreak);
        const totalTimeMs = result === "solved" ? prev.totalTimeMs + elapsed : prev.totalTimeMs;
        return {
          solved,
          failed,
          currentStreak,
          bestStreak,
          totalTimeMs
        };
      });
    },
    []
  );

  const startPuzzleMode = useCallback(() => {
    setMode("puzzle");
    setCurrentPuzzle(null);
    setStatus("idle");
    setMessage("Выберите задачу из списка");
    setBoardFen("start");
    setHintVisible(false);
    setKingInCheckSquare(null);
  }, []);

  const startFreeMode = useCallback(() => {
    setMode("free");
    const fresh = new Chess();
    engineRef.current = fresh;
    setCurrentPuzzle(null);
    setBoardFen(fresh.fen());
    setStatus("free_play");
    setMessage("Свободная практика: делайте любые ходы.");
    setHintVisible(false);
    setKingInCheckSquare(null);
  }, []);

  const setFreePlayColor = useCallback((color: "white" | "black") => {
    setPlayerColor(color);
    if (mode === "free") {
      const fresh = new Chess();
      engineRef.current = fresh;
      setBoardFen(fresh.fen());
      setKingInCheckSquare(null);
    }
  }, [mode]);

  const retryPuzzle = useCallback(() => {
    if (!currentPuzzle) {
      loadRandomPuzzle();
      return;
    }
    engineRef.current = new Chess(currentPuzzle.fen);
    moveIndexRef.current = 0;
    startTimeRef.current = performance.now();
    setBoardFen(currentPuzzle.fen);
    setStatus("in_progress");
    setMessage("Попробуйте ещё раз.");
    setHintVisible(false);
    setKingInCheckSquare(null);
  }, [currentPuzzle, loadRandomPuzzle]);

  const skipPuzzle = useCallback(() => {
    if (mode === "puzzle" && currentPuzzle) {
      updateStats("failed");
    }
    loadRandomPuzzle();
  }, [currentPuzzle, loadRandomPuzzle, mode, updateStats]);

  const onPieceDrop = useCallback(
    (source: string, target: string, piece: string, promotion?: string) => {
      const finalPromotion = promotion ||
        (piece.toLowerCase() === "p" && (target[1] === "8" || target[1] === "1")
          ? "q"
          : undefined);

      const move = engineRef.current.move({
        from: source,
        to: target,
        promotion: finalPromotion
      });

      if (!move) {
        return false;
      }

      setBoardFen(engineRef.current.fen());

      if (mode === "free" || !currentPuzzle || status !== "in_progress") {
        refreshBoardState();
        return true;
      }

      const expectedMove = currentPuzzle.solution[moveIndexRef.current];
      const played = moveToUci(move);

      if (played !== expectedMove) {
        setStatus("failed");
        setMessage("Не тот ход. Попробуйте другую идею.");
        updateStats("failed");
        refreshBoardState();
        return true;
      }

      moveIndexRef.current += 1;

      if (moveIndexRef.current >= currentPuzzle.solution.length) {
        setStatus("solved");
        setMessage("Отлично! Задача решена.");
        updateStats("solved");
        refreshBoardState();
        return true;
      }

      const replyUci = currentPuzzle.solution[moveIndexRef.current];
      setTimeout(() => {
        const replyMove = engineRef.current.move(uciToShortMove(replyUci));
        if (replyMove) {
          setBoardFen(engineRef.current.fen());
        }
        moveIndexRef.current += 1;
        setMessage("Найдите следующий ход.");
        refreshBoardState();
      }, 1000);
      return true;
    },
    [currentPuzzle, mode, refreshBoardState, status, updateStats]
  );

  const revealHint = useCallback(() => {
    setHintVisible(true);
  }, []);

  const orientation = useMemo(() => boardOrientation, [boardOrientation]);

  return {
    mode,
    status,
    message,
    currentPuzzle,
    boardFen,
    orientation,
    stats: {
      ...stats,
      averageTime
    },
    hintVisible,
    kingInCheckSquare,
    playerColor,
    freePlayResult,
    actions: {
      startPuzzleMode,
      startFreeMode,
      retryPuzzle,
      skipPuzzle,
      onPieceDrop,
      revealHint,
      loadPuzzleById,
      setFreePlayColor,
      confirmFreePlayReset: () => {
        setFreePlayResult(null);
        const fresh = new Chess();
        engineRef.current = fresh;
        setBoardFen(fresh.fen());
        setKingInCheckSquare(null);
      }
    }
  };
};

