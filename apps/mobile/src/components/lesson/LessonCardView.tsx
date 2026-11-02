import { HowtoCardView } from "@/components/lesson/HowtoCardView";
import { PlaceholderCardView } from "@/components/lesson/PlaceholderCardView";
import { ResultCardView } from "@/components/lesson/ResultCardView";
import { SummaryCardView } from "@/components/lesson/SummaryCardView";
import { ToolCardView } from "@/components/lesson/ToolCardView";
import type { LessonCard } from "@/data/lessons";

type LessonCardViewProps = {
  card: LessonCard;
};

// Выбирает, какой компонент показать, по типу карточки.
export function LessonCardView({ card }: LessonCardViewProps) {
  switch (card.type) {
    case "result":
      return <ResultCardView card={card} />;
    case "tool":
      return <ToolCardView card={card} />;
    case "howto":
      return <HowtoCardView card={card} />;
    case "summary":
      return <SummaryCardView card={card} />;
    case "quiz":
    case "practice":
      return <PlaceholderCardView />;
  }
}
