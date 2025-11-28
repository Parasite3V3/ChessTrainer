import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { TrainerStatus } from "../hooks/usePuzzleTrainer";

interface Props {
  fen: string;
  orientation: "white" | "black";
  status: TrainerStatus;
  message: string;
  onPieceDrop: (source: string, target: string, piece: string, promotion?: string) => boolean;
  kingInCheckSquare: string | null;
}

const MIN_SIZE = 280;
const MAX_SIZE = 620;

const clampSize = (value: number) => Math.min(Math.max(value, MIN_SIZE), MAX_SIZE);

export const ChessBoardPanel = ({
  fen,
  orientation,
  status,
  message,
  onPieceDrop,
  kingInCheckSquare
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [boardSize, setBoardSize] = useState(() => {
    const baseWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    return clampSize(baseWidth * 0.4);
  });
  const isBoardLocked = status === "solved" || status === "failed";
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const [promotionToSquare, setPromotionToSquare] = useState<string | null>(null);
  const [promotionFromSquare, setPromotionFromSquare] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  useEffect(() => {
    const updateFromContainer = () => {
      const containerWidth = wrapperRef.current?.clientWidth ?? window.innerWidth;
      const size = clampSize(containerWidth * 0.9);
      setBoardSize(size);
    };
    updateFromContainer();
    window.addEventListener("resize", updateFromContainer);
    return () => window.removeEventListener("resize", updateFromContainer);
  }, []);

  useEffect(() => {
    setSelectedSquare(null);
    setLegalTargets([]);
  }, [fen]);

  const startResizing = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = boardSize;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const deltaY = startY - moveEvent.clientY;
      const delta = (deltaX + deltaY) / 2;
      setBoardSize(clampSize(startSize + delta));
    };

    const stop = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stop);
  };

  const game = useMemo(() => {
    const instance = new Chess();
    if (fen === "start") {
      instance.reset();
    } else {
      instance.load(fen);
    }
    return instance;
  }, [fen]);

  const boardStyle = useMemo(
    () => ({
      width: boardSize,
      height: boardSize
    }),
    [boardSize]
  );

  const highlightStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};

    if (kingInCheckSquare) {
      styles[kingInCheckSquare] = {
        boxShadow: "inset 0 0 0 4px rgba(255, 74, 74, 0.95)"
      };
    }

    if (selectedSquare) {
      styles[selectedSquare] = {
        boxShadow: "inset 0 0 0 4px rgba(90, 114, 255, 0.9)"
      };
    }

    legalTargets.forEach((square) => {
      styles[square] = {
        boxShadow: "inset 0 0 0 4px rgba(255, 255, 255, 0.65)",
        borderRadius: "50%"
      };
    });

    return styles;
  }, [kingInCheckSquare, legalTargets, selectedSquare]);

  const resetSelection = () => {
    setSelectedSquare(null);
    setLegalTargets([]);
    setPromotionToSquare(null);
    setPromotionFromSquare(null);
    setShowPromotionDialog(false);
  };

  const tryMoveByClick = (targetSquare: string) => {
    if (!selectedSquare) {
      return;
    }
    const piece = game.get(selectedSquare);
    if (!piece) {
      resetSelection();
      return;
    }

    const isPromotion = piece.type === "p" && (targetSquare[1] === "8" || targetSquare[1] === "1");
    
    if (isPromotion) {
      setPromotionFromSquare(selectedSquare);
      setPromotionToSquare(targetSquare);
      setShowPromotionDialog(true);
      return;
    }

    const pieceName = `${piece.color}${piece.type.toUpperCase()}`;
    const moveSuccessful = onPieceDrop(selectedSquare, targetSquare, pieceName);
    if (moveSuccessful) {
      resetSelection();
    }
  };

  const handleSquareClick = (square: string) => {
    if (isBoardLocked) {
      return;
    }

    if (legalTargets.includes(square)) {
      tryMoveByClick(square);
      return;
    }

    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      resetSelection();
      return;
    }

    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalTargets(moves.map((move) => move.to));
  };

  return (
    <section className="panel board-panel">
      <h2>Игровое поле</h2>
      <div className="board-wrapper" ref={wrapperRef}>
        <div className="board-shell" style={boardStyle}>
          <Chessboard
            position={fen}
            onPieceDrop={(source, target, piece) => {
              const isPromotion = piece.toLowerCase() === "p" && (target[1] === "8" || target[1] === "1");
              if (isPromotion) {
                setPromotionFromSquare(source);
                setPromotionToSquare(target);
                setShowPromotionDialog(true);
                return false;
              }
              return onPieceDrop(source, target, piece);
            }}
            onPromotionCheck={(source, target, piece) => {
              return piece.toLowerCase() === "p" && (target[1] === "8" || target[1] === "1");
            }}
            onPromotionPieceSelect={(promotionPiece, from, to) => {
              const actualFrom = from || promotionFromSquare;
              const actualTo = to || promotionToSquare;
              
              if (!actualFrom || !actualTo) {
                resetSelection();
                return false;
              }
              
              const piece = game.get(actualFrom);
              if (!piece) {
                resetSelection();
                return false;
              }
              
              const pieceName = `${piece.color}${piece.type.toUpperCase()}`;
              const promotion = promotionPiece?.toLowerCase().replace(/^[wb]/, "") || "q";
              const result = onPieceDrop(actualFrom, actualTo, pieceName, promotion);
              
              if (result) {
                resetSelection();
              } else {
                resetSelection();
              }
              
              return result;
            }}
            promotionDialogVariant="default"
            promotionToSquare={promotionToSquare}
            showPromotionDialog={showPromotionDialog}
            boardWidth={boardSize}
            boardOrientation={orientation}
            arePiecesDraggable={!isBoardLocked}
            onSquareClick={handleSquareClick}
            customSquareStyles={highlightStyles}
            customBoardStyle={{ width: `${boardSize}px`, height: `${boardSize}px` }}
            snapToCursor={true}
            customPieceStyle={{
              cursor: "grab"
            }}
            customPiecesStyle={{
              cursor: "grabbing"
            }}
            customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
            customDarkSquareStyle={{ backgroundColor: "#b58863" }}
          />
          <div className="resize-handle" role="slider" onPointerDown={startResizing} aria-label="Размер доски" />
          {isBoardLocked && (
            <div className="board-overlay">
              {status === "solved" ? "Задача решена!" : "Промах. Попробуйте снова."}
            </div>
          )}
        </div>
      </div>
      <p className="message">{message}</p>
    </section>
  );
};

