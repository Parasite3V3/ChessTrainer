import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { PuzzleLibraryPage } from "./routes/PuzzleLibraryPage";
import { TheoryPage } from "./routes/TheoryPage";
import { TrainingPage } from "./routes/TrainingPage";
import { LearningPage } from "./routes/LearningPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="main-nav">
          <h1>ChessTrainer</h1>
          <div>
            <NavLink to="/" end>
              Тренажёр
            </NavLink>
            <NavLink to="/puzzles">Задачи</NavLink>
            <NavLink to="/theory">Теория</NavLink>
            <NavLink to="/learning">Обучение</NavLink>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<TrainingPage />} />
          <Route path="/puzzles" element={<PuzzleLibraryPage />} />
          <Route path="/theory" element={<TheoryPage />} />
          <Route path="/learning" element={<LearningPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;


