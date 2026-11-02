import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  AnswerOption,
  type AnswerState,
} from "@/components/lesson/AnswerOption";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { QuizCard } from "@/data/lessons";
import { theme } from "@/theme";

type QuizCardViewProps = {
  card: QuizCard;
  // Вызывается один раз, когда пользователь выбрал ответ.
  onAnswered: () => void;
};

// Карточка «Проверка»: ситуация, вопрос и варианты ответа.
export function QuizCardView({ card, onAnswered }: QuizCardViewProps) {
  // Номер выбранного варианта; null — ещё не ответили.
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = answered && card.options[selected].correct;

  function handleSelect(index: number) {
    setSelected(index);
    onAnswered();
  }

  // После ответа правильный вариант всегда зелёный, а выбранный неверный — красный.
  function getState(index: number): AnswerState {
    if (!answered) return "default";
    if (card.options[index].correct) return "correct";
    if (index === selected) return "wrong";
    return "default";
  }

  return (
    <View style={styles.container}>
      <LessonLabel text="Проверка" />
      <Text style={styles.situation}>{card.situation}</Text>
      <Text style={styles.question}>{card.question}</Text>

      <View style={styles.options} accessibilityRole="radiogroup">
        {card.options.map((option, index) => (
          <AnswerOption
            key={option.text}
            text={option.text}
            state={getState(index)}
            selected={index === selected}
            disabled={answered}
            onPress={() => handleSelect(index)}
          />
        ))}
      </View>

      {answered ? (
        <View
          style={[
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}
          accessibilityLiveRegion="polite"
        >
          <Text
            style={[
              styles.feedbackTitle,
              isCorrect ? styles.titleCorrect : styles.titleWrong,
            ]}
          >
            {isCorrect ? "Верно!" : "Не совсем"}
          </Text>
          <Text style={styles.feedbackText}>{card.explanation}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  situation: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  question: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  options: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  feedback: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  feedbackCorrect: {
    backgroundColor: theme.colors.successBg,
  },
  feedbackWrong: {
    backgroundColor: theme.colors.errorBg,
  },
  feedbackTitle: {
    ...theme.typography.headline,
  },
  titleCorrect: {
    color: theme.colors.success,
  },
  titleWrong: {
    color: theme.colors.error,
  },
  feedbackText: {
    ...theme.typography.callout,
    color: theme.colors.text,
  },
});
