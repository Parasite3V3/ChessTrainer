import { useMemo } from "react";
import { LearningSection } from "../components/LearningSection";
import { learningContent } from "../data/learningContent";

export const LearningPage = () => {
  const content = useMemo(() => learningContent, []);

  if (!content || content.length === 0) {
    return (
      <section>
        <header className="page-header">
          <p className="badge">Обучение</p>
          <h1>Основы шахмат</h1>
          <p className="muted">Контент загружается...</p>
        </header>
      </section>
    );
  }

  return (
    <section>
      <header className="page-header">
        <p className="badge">Обучение</p>
        <h1>Основы шахмат</h1>
        <p className="muted">
          Изучите правила игры, как ходят фигуры и их относительную ценность.
        </p>
      </header>
      <div className="learning-container">
        {content.map((section) => (
          <LearningSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
};

