import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { LessonCardView } from "@/components/lesson/LessonCardView";
import { ProgressHeader } from "@/components/ProgressHeader";
import { getLesson } from "@/data/lessons";
import { theme } from "@/theme";

// Экран урока: по одной карточке за раз. Адрес /lesson/4 → id = "4".
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);
  // Номер текущей карточки, начиная с 0.
  const [index, setIndex] = useState(0);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.notFound} edges={["top", "bottom"]}>
        <Text style={styles.notFoundText}>Урок не найден</Text>
        <Button
          title="Назад"
          variant="secondary"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const total = lesson.cards.length;
  const isLast = index === total - 1;

  function handleNext() {
    if (isLast) {
      router.replace("/home");
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <ProgressHeader button="close" step={index + 1} total={total} />
      </View>

      {/* key={index}: при смене карточки прокрутка начинается сверху. */}
      <ScrollView key={index} contentContainerStyle={styles.content}>
        <LessonCardView card={lesson.cards[index]} />
      </ScrollView>

      <View style={styles.actions}>
        <Button title={isLast ? "Завершить" : "Дальше"} onPress={handleNext} />
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
