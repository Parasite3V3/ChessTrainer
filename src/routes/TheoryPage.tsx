import { TheoryCard } from "../components/TheoryCard";
import { theoryTopics } from "../data/theoryTopics";

export const TheoryPage = () => {
  return (
    <section>
      <header className="page-header">
        <p className="badge">Теория</p>
        <h1>Изучи основы и тактику</h1>
        <p className="muted">
          Каждая карточка содержит краткое описание приёма и интерактивную позицию для закрепления.
        </p>
      </header>
      <div className="grid grid-3">
        {theoryTopics.map((topic) => (
          <TheoryCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
};

