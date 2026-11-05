import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Lesson, LessonStatus } from "@/data/lessons";
import { theme } from "@/theme";

type LessonRowProps = {
  lesson: Lesson;
  status: LessonStatus;
  onPress: () => void;
};

const NUMBER_SIZE = 36;

const STATUS_TEXT: Record<LessonStatus, string> = {
  available: "",
  completed: "Пройден",
  soon: "Скоро",
  premium: "Подписка",
};

// Строка урока в списке. Открыть можно доступный или уже пройденный урок.
export function LessonRow({ lesson, status, onPress }: LessonRowProps) {
  const canOpen = status === "available" || status === "completed";
  const meta = `Уровень ${lesson.level} · ${lesson.minutes} мин`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!canOpen}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canOpen }}
      accessibilityLabel={[
        `Урок ${lesson.id}. ${lesson.title}`,
        `Уровень ${lesson.level}, ${lesson.minutes} минут`,
        STATUS_TEXT[status],
      ]
        .filter(Boolean)
        .join(". ")}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {status === "completed" ? (
        <View style={[styles.number, styles.numberCompleted]}>
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={16}
            weight="bold"
            tintColor={theme.colors.onAccent}
          />
        </View>
      ) : (
        <View style={[styles.number, !canOpen && styles.numberMuted]}>
          <Text style={[styles.numberText, !canOpen && styles.numberTextMuted]}>
            {lesson.id}
          </Text>
        </View>
      )}

      <View style={styles.texts}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>

      {status === "available" ? (
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          size={16}
          weight="semibold"
          tintColor={theme.colors.textSecondary}
        />
      ) : (
        <View style={[styles.tag, tagStyles[status]]}>
          <Text style={[styles.tagText, tagTextStyles[status]]}>
            {STATUS_TEXT[status]}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  number: {
    width: NUMBER_SIZE,
    height: NUMBER_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  numberMuted: {
    backgroundColor: theme.colors.track,
  },
  numberCompleted: {
    backgroundColor: theme.colors.success,
  },
  numberText: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  numberTextMuted: {
    color: theme.colors.textSecondary,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  meta: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  tag: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.full,
  },
  tagText: {
    ...theme.typography.label,
  },
});

// Цвет метки: «Пройден» зелёная, «Скоро» серая, «Подписка» жёлтая.
const tagStyles = StyleSheet.create({
  available: {},
  completed: { backgroundColor: theme.colors.successBg },
  soon: { backgroundColor: theme.colors.track },
  premium: { backgroundColor: theme.colors.warningBg },
});

const tagTextStyles = StyleSheet.create({
  available: {},
  completed: { color: theme.colors.success },
  soon: { color: theme.colors.textSecondary },
  premium: { color: theme.colors.warning },
});
