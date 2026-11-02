import { HowtoCardView } from "@/components/lesson/HowtoCardView";
import { PracticeCardView } from "@/components/lesson/PracticeCardView";
import { QuizCardView } from "@/components/lesson/QuizCardView";
import { ResultCardView } from "@/components/lesson/ResultCardView";
import { SummaryCardView } from "@/components/lesson/SummaryCardView";
import { ToolCardView } from "@/components/lesson/ToolCardView";
import type { LessonCard, ToolCard } from "@/data/lessons";

type LessonCardViewProps = {
  card: LessonCard;
  // Инструмент урока — для кнопки «Открыть …» в практике.
  tool?: ToolCard;
  // Пользователь ответил на вопрос в карточке quiz.
  onQuizAnswered: () => void;
};

// Выбирает, какой компонент показать, по типу карточки.
export function LessonCardView({
  card,
  tool,
  onQuizAnswered,
}: LessonCardViewProps) {
  switch (card.type) {
    case "result":
      return <ResultCardView card={card} />;
    case "tool":
      return <ToolCardView card={card} />;
    case "howto":
      return <HowtoCardView card={card} />;
    case "quiz":
      return <QuizCardView card={card} onAnswered={onQuizAnswered} />;
    case "practice":
      return <PracticeCardView card={card} tool={tool} />;
    case "summary":
      return <SummaryCardView card={card} />;
  }
}
