import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChessBoardPanel } from "../components/ChessBoardPanel";
import { PuzzlePanel } from "../components/PuzzlePanel";
import { ResultModal } from "../components/ResultModal";
import { StatsPanel } from "../components/StatsPanel";
import { usePuzzleTrainer } from "../hooks/usePuzzleTrainer";

export const TrainingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trainer = usePuzzleTrainer();
  const {
    mode,
    status,
    message,
    currentPuzzle,
    boardFen,
    orientation,
    stats,
    hintVisible,
    kingInCheckSquare,
    playerColor,
    freePlayResult,
    actions
  } = trainer;
  const {
    loadPuzzleById,
    confirmFreePlayReset,
    onPieceDrop,
    startFreeMode,
    startPuzzleMode,
    retryPuzzle,
    skipPuzzle,
    revealHint,
    setFreePlayColor
  } = actions;

  useEffect(() => {
    const state = location.state as { puzzleId?: string } | undefined;
    if (state?.puzzleId) {
      const loaded = loadPuzzleById(state.puzzleId);
      if (loaded) {
        navigate("/", { replace: true, state: {} });
      }
    }
  }, [loadPuzzleById, location.state, navigate]);

  return (
    <>
      <header className="page-header">
        <p className="badge">Локальный тренажёр</p>
        <h1>ChessTrainer</h1>
        <p className="muted">
          Тренируйтесь на тактических задачах или проводите свободные партии. Все режимы работают
          локально, без подключения к серверам.
        </p>
      </header>
      <main className="trainer-layout">
        <PuzzlePanel
          mode={mode}
          status={status}
          puzzle={currentPuzzle}
          hintVisible={hintVisible}
          playerColor={playerColor}
          actions={{
            startPuzzleMode,
            startFreeMode,
            retryPuzzle,
            skipPuzzle,
            revealHint,
            setFreePlayColor,
            loadPuzzleById
          }}
        />
        <ChessBoardPanel
          fen={boardFen}
          orientation={orientation}
          status={status}
          message={message}
          onPieceDrop={onPieceDrop}
          kingInCheckSquare={kingInCheckSquare}
        />
        <StatsPanel stats={stats} />
      </main>
      {freePlayResult && (
        <ResultModal
          title="Мат в свободной партии"
          message={`${freePlayResult.message} Нажмите OK, чтобы начать новую.`}
          onClose={confirmFreePlayReset}
        />
      )}
    </>
  );
};

