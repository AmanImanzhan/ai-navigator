import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { LessonId } from "@/data/lessons";
import { useTracks } from "@/hooks/useLessons";
import { theme } from "@/theme";

type LessonChipsProps = {
  lessonIds: LessonId[];
};

// Метки «Урок N». Нажатие открывает урок; платный урок — только объясняем, что он по подписке.
export function LessonChips({ lessonIds }: LessonChipsProps) {
  const { t } = useTranslation();
  const tracks = useTracks();

  if (lessonIds.length === 0) {
    return <Text style={styles.empty}>{t("library.noLessons")}</Text>;
  }

  function handlePress(lessonId: LessonId) {
    const track = tracks.find((item) =>
      item.lessons.some((lesson) => lesson.id === lessonId),
    );
    const lesson = track?.lessons.find((item) => item.id === lessonId);

    if (track?.premium) {
      Alert.alert(
        t("library.premiumTitle"),
        t("library.premiumMessage", {
          lesson: lessonId,
          title: lesson?.title ?? "",
        }),
        [{ text: t("prompts.ok") }],
      );
      return;
    }

    router.push({ pathname: "/lesson/[id]", params: { id: lessonId } });
  }

  return (
    <View style={styles.chips}>
      {lessonIds.map((lessonId) => {
        const title =
          tracks
            .flatMap((track) => track.lessons)
            .find((lesson) => lesson.id === lessonId)?.title ?? "";
        return (
          <Pressable
            key={lessonId}
            onPress={() => handlePress(lessonId)}
            accessibilityRole="button"
            accessibilityLabel={t("library.lessonChipA11y", {
              lesson: lessonId,
              title,
            })}
            style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
          >
            <Text style={styles.chipText}>
              {t("library.lessonChip", { lesson: lessonId })}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  chip: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  chipText: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  empty: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
});
