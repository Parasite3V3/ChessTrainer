import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/puzzles.json";
import { Difficulty, Puzzle } from "../types/puzzle";

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Легко",
  medium: "Средне",
  hard: "Сложно"
};

export const PuzzleLibraryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Difficulty>("easy");

  const filteredPuzzles = useMemo(
    () => (data as Puzzle[]).filter((puzzle) => puzzle.difficulty === filter),
    [filter]
  );

  return (
    <section>
      <header className="page-header">
        <p className="badge">Каталог задач</p>
        <h1>Тренируйтесь по темам</h1>
        <p className="muted">
          Отфильтруйте задачи по сложности и запустите любую из них прямо в тренажёре.
        </p>
      </header>
      <div className="panel">
        <div className="actions">
          {difficultyOptions.map((option) => (
            <button
              key={option}
              className={filter === option ? "primary" : ""}
              onClick={() => setFilter(option)}
            >
              {difficultyLabels[option]}
            </button>
          ))}
        </div>
        <div className="grid grid-3">
          {filteredPuzzles.map((puzzle, index) => (
            <article key={puzzle.id} className="puzzle-card">
              <span className="badge badge-muted">
                #{index + 1} · {puzzle.theme}
              </span>
              <h3>{puzzle.description}</h3>
              <p className="muted">Ходят {puzzle.sideToMove === "white" ? "белые" : "чёрные"}.</p>
              <button className="primary" onClick={() => navigate("/", { state: { puzzleId: puzzle.id } })}>
                Открыть задачу
              </button>
            </article>
          ))}
          {filteredPuzzles.length === 0 && <p>Для выбранной сложности пока нет задач.</p>}
        </div>
      </div>
    </section>
  );
};

