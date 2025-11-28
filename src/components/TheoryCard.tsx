import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { TheoryTopic } from "../data/theoryTopics";

interface Props {
  topic: TheoryTopic;
}

export const TheoryCard = ({ topic }: Props) => {
  const [fen, setFen] = useState(topic.fen);
  const engineRef = useRef(new Chess(topic.fen));

  const handleDrop = (source: string, target: string, piece: string) => {
    const promotion =
      piece.toLowerCase() === "p" && (target[1] === "8" || target[1] === "1") ? "q" : undefined;
    const move = engineRef.current.move({ from: source, to: target, promotion });
    if (!move) {
      return false;
    }
    setFen(engineRef.current.fen());
    return true;
  };

  const resetPosition = () => {
    engineRef.current = new Chess(topic.fen);
    setFen(topic.fen);
  };

  return (
    <article className="theory-card">
      <span className="badge badge-muted">{topic.category}</span>
      <h3>{topic.title}</h3>
      <p className="muted">{topic.description}</p>
      <ul>
        {topic.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="theory-board">
        <Chessboard
          position={fen}
          boardWidth={280}
          onPieceDrop={handleDrop}
          boardOrientation={topic.orientation ?? "white"}
          customLightSquareStyle={{ backgroundColor: "#f6edd6" }}
          customDarkSquareStyle={{ backgroundColor: "#b98a60" }}
        />
      </div>
      <button onClick={resetPosition}>Сбросить позицию</button>
    </article>
  );
};

