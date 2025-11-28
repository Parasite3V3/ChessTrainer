import { useMemo, memo } from "react";
import { Chessboard } from "react-chessboard";
import { AnimatedBoard } from "./AnimatedBoard";
import { LearningSection as LearningSectionType } from "../data/learningContent";

interface LearningSectionProps {
  section: LearningSectionType;
}

export const LearningSection = memo(({ section }: LearningSectionProps) => {
  if (!section) return null;
  
  const hasAnimation = useMemo(() => section.animatedMoves && section.animatedMoves.length > 0, [section.animatedMoves]);
  const hasStaticBoard = useMemo(() => section.boardFen && !hasAnimation, [section.boardFen, hasAnimation]);
  const processedContent = useMemo(() => {
    return section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
  }, [section.content]);

  try {
    return (
      <article className="learning-section">
        <h2>{section.title}</h2>
        <div className="learning-content">
          <div 
            className="learning-text" 
            dangerouslySetInnerHTML={{ 
              __html: processedContent
            }} 
          />
          {hasStaticBoard && (
            <div className="learning-board">
              <Chessboard
                position={section.boardFen}
                boardOrientation={section.boardOrientation || "white"}
                arePiecesDraggable={false}
                boardWidth={400}
              />
            </div>
          )}
          {hasAnimation && section.boardFen && section.animatedMoves && (
            <div className="learning-board">
              <AnimatedBoard
                fen={section.boardFen}
                moves={section.animatedMoves}
                orientation={section.boardOrientation || "white"}
                animationSpeed={2000}
                resetAfterEach={section.resetAfterEach}
              />
            </div>
          )}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Ошибка рендеринга секции:", error, section);
    return (
      <article className="learning-section">
        <h2>{section.title}</h2>
        <p>Ошибка загрузки контента</p>
      </article>
    );
  }
});

