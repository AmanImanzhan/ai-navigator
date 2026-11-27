import { SymbolView, type SFSymbol } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ResultCardView } from "@/components/lesson/ResultCardView";
import type { Lesson, ResultCard, TrackId } from "@/data/lessons";
import { TRACK_ICONS } from "@/data/trackIcons";
import { theme } from "@/theme";

type LessonCoverProps = {
  lesson: Pick<Lesson, "title" | "level" | "minutes">;
  // Направление урока — надзаголовок над названием. Нет — без надзаголовка.
  track?: { id: TrackId; title: string };
  // Первая карточка урока — вступление.
  result: ResultCard;
};

const TRACK_ICON_SIZE = 15;
const CHIP_ICON_SIZE = 13;

// Первый экран урока — обложка: направление, название, время и уровень,
// затем вступление к уроку. Всё — из данных урока.
export function LessonCover({ lesson, track, result }: LessonCoverProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {track ? (
          <View style={styles.eyebrow}>
            <SymbolView
              name={TRACK_ICONS[track.id]}
              size={TRACK_ICON_SIZE}
              tintColor={theme.colors.accent}
            />
            <Text style={styles.eyebrowText}>{track.title}</Text>
          </View>
        ) : null}

        <Text style={styles.title} accessibilityRole="header">
          {lesson.title}
        </Text>

        <View style={styles.chips}>
          <Chip icon="clock" text={t("lesson.cover.minutes", { minutes: lesson.minutes })} />
          <Chip icon="chart.bar" text={t("lesson.cover.level", { level: lesson.level })} />
        </View>
      </View>

      <ResultCardView card={result} />
    </View>
  );
}

function Chip({ icon, text }: { icon: SFSymbol; text: string }) {
  return (
    <View style={styles.chip}>
      <SymbolView
        name={icon}
        size={CHIP_ICON_SIZE}
        tintColor={theme.colors.textSecondary}
      />
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xxs,
  },
  eyebrowText: {
    ...theme.typography.label,
    color: theme.colors.accent,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  chipText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
});
