import { useEffect, useState, useRef, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface AnimatedBoardProps {
  fen: string;
  moves: string[][];
  orientation?: "white" | "black";
  animationSpeed?: number;
  resetAfterEach?: boolean;
}

type AnimationState = "highlight" | "move" | "wait";

export const AnimatedBoard = ({ fen, moves, orientation = "white", animationSpeed = 2000, resetAfterEach = false }: AnimatedBoardProps) => {
  const [currentFen, setCurrentFen] = useState(fen);
  const [highlightSquares, setHighlightSquares] = useState<Record<string, { backgroundColor: string }>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>(undefined);
  const moveIndexRef = useRef(0);
  const currentSequenceRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const gameRef = useRef<Chess | null>(null);
  const movesRef = useRef<string[][]>(moves);
  const fenRef = useRef<string>(fen);
  const isInitializedRef = useRef(false);
  const animationStateRef = useRef<AnimationState>("wait");

  useEffect(() => {
    movesRef.current = moves;
    fenRef.current = fen;
  }, [moves, fen]);

  useEffect(() => {
    try {
      gameRef.current = new Chess(fen);
      setCurrentFen(fen);
      moveIndexRef.current = 0;
      currentSequenceRef.current = 0;
      fenRef.current = fen;
      animationStateRef.current = "wait";
      setHighlightSquares({});
      setSelectedSquare(undefined);
      
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.warn("FEN может быть неполным для демонстрации:", fen);
      try {
        gameRef.current = new Chess();
        setCurrentFen(fen);
      } catch (e) {
        console.error("Ошибка инициализации игры:", error);
      }
    }
  }, [fen]);

  useEffect(() => {
    if (moves.length === 0) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      gameRef.current = new Chess(fenRef.current);
      setCurrentFen(fenRef.current);
      moveIndexRef.current = 0;
      currentSequenceRef.current = 0;
      animationStateRef.current = "wait";
      setHighlightSquares({});
      setSelectedSquare(undefined);
    } catch (error) {
      console.error("Ошибка создания игры:", error);
      return;
    }

    const resetGame = () => {
      try {
        gameRef.current = new Chess(fenRef.current);
        setCurrentFen(fenRef.current);
        moveIndexRef.current = 0;
        currentSequenceRef.current = 0;
        animationStateRef.current = "wait";
        setHighlightSquares({});
        setSelectedSquare(undefined);
      } catch (error) {
        console.error("Ошибка сброса игры:", error);
      }
    };

    const executeNextMove = () => {
      if (!gameRef.current) {
        console.log("gameRef.current is null");
        return;
      }
      
      const currentMoves = movesRef.current;
      if (!currentMoves || currentMoves.length === 0) {
        console.log("No moves available");
        return;
      }
      
      const sequence = currentMoves[currentSequenceRef.current];
      
      if (!sequence || moveIndexRef.current >= sequence.length) {
        if (resetAfterEach) {
          try {
            gameRef.current = new Chess(fenRef.current);
            setCurrentFen(fenRef.current);
            setHighlightSquares({});
            setSelectedSquare(undefined);
            animationStateRef.current = "wait";
            if (currentSequenceRef.current < currentMoves.length - 1) {
              currentSequenceRef.current += 1;
              moveIndexRef.current = 0;
            } else {
              currentSequenceRef.current = 0;
              moveIndexRef.current = 0;
            }
          } catch (error) {
            console.error("Ошибка создания новой игры:", error);
          }
        } else {
          if (currentSequenceRef.current < currentMoves.length - 1) {
            currentSequenceRef.current += 1;
            moveIndexRef.current = 0;
            try {
              gameRef.current = new Chess(fenRef.current);
              setCurrentFen(fenRef.current);
              setHighlightSquares({});
              setSelectedSquare(undefined);
              animationStateRef.current = "wait";
            } catch (error) {
              console.error("Ошибка создания новой игры:", error);
            }
          } else {
            resetGame();
          }
        }
        return;
      }

      const moveStr = sequence[moveIndexRef.current];
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.substring(4);

      if (animationStateRef.current === "wait") {
        animationStateRef.current = "highlight";
        setSelectedSquare(from);
        
        try {
          const possibleMoves = gameRef.current.moves({ square: from as any, verbose: true, legal: false });
          const highlights: Record<string, { backgroundColor: string }> = {};
          possibleMoves.forEach((move: any) => {
            highlights[move.to] = { backgroundColor: "rgba(90, 114, 255, 0.4)" };
          });
          setHighlightSquares(highlights);
        } catch (error) {
          const highlights: Record<string, { backgroundColor: string }> = {};
          highlights[to] = { backgroundColor: "rgba(90, 114, 255, 0.4)" };
          setHighlightSquares(highlights);
        }
      } else if (animationStateRef.current === "highlight") {
        animationStateRef.current = "move";
      } else if (animationStateRef.current === "move") {
        try {
          const move = gameRef.current.move({ from, to, promotion: promotion || undefined });
          if (move) {
            setCurrentFen(gameRef.current.fen());
            setHighlightSquares({});
            setSelectedSquare(undefined);
            moveIndexRef.current += 1;
            animationStateRef.current = "wait";
          } else {
            moveIndexRef.current += 1;
            animationStateRef.current = "wait";
          }
        } catch (error) {
          try {
            const tempGame = new Chess(gameRef.current.fen());
            tempGame.move({ from, to, promotion: promotion || undefined });
            setCurrentFen(tempGame.fen());
            setHighlightSquares({});
            setSelectedSquare(undefined);
            moveIndexRef.current += 1;
            animationStateRef.current = "wait";
            gameRef.current = tempGame;
          } catch (e) {
            moveIndexRef.current += 1;
            animationStateRef.current = "wait";
          }
        }
      }
    };

    intervalRef.current = setInterval(executeNextMove, animationSpeed);
    
    setTimeout(() => executeNextMove(), 100);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [moves, fen, animationSpeed, resetAfterEach]);

  return (
    <div className="animated-board-wrapper">
      <Chessboard
        position={currentFen}
        boardOrientation={orientation}
        arePiecesDraggable={false}
        boardWidth={400}
        customSquareStyles={{
          ...highlightSquares,
          ...(selectedSquare ? { [selectedSquare as string]: { backgroundColor: "rgba(90, 114, 255, 0.6)" } } : {})
        }}
      />
    </div>
  );
};

