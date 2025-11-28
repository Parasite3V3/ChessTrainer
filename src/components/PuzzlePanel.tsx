import { Puzzle } from "../types/puzzle";
import { TrainerStatus } from "../hooks/usePuzzleTrainer";
import puzzles from "../data/puzzles.json";

interface Props {
  mode: "puzzle" | "free";
  status: TrainerStatus;
  puzzle: Puzzle | null;
  hintVisible: boolean;
  playerColor: "white" | "black";
  actions: {
    startPuzzleMode: () => void;
    startFreeMode: () => void;
    retryPuzzle: () => void;
    skipPuzzle: () => void;
    revealHint: () => void;
    setFreePlayColor: (color: "white" | "black") => void;
    loadPuzzleById: (id: string) => boolean;
  };
}

const difficultyLabel: Record<string, string> = {
  easy: "Легко",
  medium: "Средне",
  hard: "Сложно"
};

export const PuzzlePanel = ({ mode, status, puzzle, hintVisible, playerColor, actions }: Props) => {
  return (
    <section className="panel">
      <h2>Режимы и подсказки</h2>
      <div className="actions">
        <button className={mode === "puzzle" ? "primary" : ""} onClick={actions.startPuzzleMode}>
          Тактические задачи
        </button>
        <button className={mode === "free" ? "primary" : ""} onClick={actions.startFreeMode}>
          Свободная практика
        </button>
      </div>

      {mode === "puzzle" && (
        <>
          {!puzzle ? (
            <>
              <p className="muted">Выберите задачу из списка:</p>
              <div className="puzzle-list">
                {(puzzles as Puzzle[]).map((p, index) => (
                  <button
                    key={p.id}
                    className="puzzle-item"
                    onClick={() => actions.loadPuzzleById(p.id)}
                  >
                    <span className="puzzle-number">#{index + 1}</span>
                    <div className="puzzle-info">
                      <span className="puzzle-theme">{p.theme}</span>
                      <span className="puzzle-desc">{p.description}</span>
                    </div>
                    <span className="puzzle-difficulty">{difficultyLabel[p.difficulty]}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="actions">
                <button onClick={actions.retryPuzzle}>Повторить</button>
                <button onClick={() => {
                  actions.startPuzzleMode();
                }}>Выбрать задачу</button>
                <button onClick={actions.revealHint} disabled={hintVisible}>
                  Подсказка
                </button>
              </div>
              <div>
                <p className="badge">
                  {difficultyLabel[puzzle.difficulty]} · {puzzle.theme}
                </p>
                <p>{puzzle.description}</p>
                {hintVisible && puzzle.hint && <div className="hint-box">💡 {puzzle.hint}</div>}
              </div>
            </>
          )}
        </>
      )}

      {mode === "free" && (
        <>
          <div className="free-settings">
            <p>Выберите сторону:</p>
            <div className="actions">
              <button className={playerColor === "white" ? "primary" : ""} onClick={() => actions.setFreePlayColor("white")}>
                Играю белыми
              </button>
              <button className={playerColor === "black" ? "primary" : ""} onClick={() => actions.setFreePlayColor("black")}>
                Играю чёрными
              </button>
            </div>
          </div>
          <p className="message">
            Статус: {status === "free_play" ? "идёт свободная партия" : "пауза"}. Используйте доску,
            чтобы отрабатывать дебюты или эндшпили.
          </p>
        </>
      )}
    </section>
  );
};

