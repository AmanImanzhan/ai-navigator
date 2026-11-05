import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { LessonCardView } from "@/components/lesson/LessonCardView";
import { ProgressHeader } from "@/components/ProgressHeader";
import { getLessonTool } from "@/data/lessons";
import { useLesson } from "@/hooks/useLessons";
import { theme } from "@/theme";

// Экран урока: по одной карточке за раз. Адрес /lesson/4 → id = "4".
export default function LessonScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  // У урока «скоро» содержимого нет — для экрана это то же, что «не найден».
  const content = useLesson(id)?.content;
  // Номер текущей карточки, начиная с 0.
  const [index, setIndex] = useState(0);
  // Ответил ли пользователь на вопрос текущей карточки quiz.
  const [quizAnswered, setQuizAnswered] = useState(false);

  if (!content) {
    return (
      <SafeAreaView style={styles.notFound} edges={["top", "bottom"]}>
        <Text style={styles.notFoundText}>{t("lesson.notFound")}</Text>
        <Button
          title={t("common.back")}
          variant="secondary"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const total = content.cards.length;
  const card = content.cards[index];
  const isLast = index === total - 1;
  // На вопросе «Дальше» не нажать, пока нет ответа.
  const nextDisabled = card.type === "quiz" && !quizAnswered;

  function handleNext() {
    if (isLast) {
      router.replace({
        pathname: "/lesson/[id]/complete",
        params: { id },
      });
    } else {
      setIndex(index + 1);
      setQuizAnswered(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="close" step={index + 1} total={total} />
      </View>

      {/* key={index}: при смене карточки прокрутка начинается сверху. */}
      <ScrollView key={index} contentContainerStyle={styles.content}>
        <LessonCardView
          card={card}
          tool={getLessonTool(content)}
          onQuizAnswered={() => setQuizAnswered(true)}
        />
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title={isLast ? t("lesson.finish") : t("common.next")}
          disabled={nextDisabled}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  top: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.xl,
  },
  actions: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xl,
  },
  notFoundText: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: "center",
  },
});
