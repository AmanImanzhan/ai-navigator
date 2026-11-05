import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { HowtoCard } from "@/data/lessons";
import { theme } from "@/theme";

type HowtoCardViewProps = {
  card: HowtoCard;
};

const NUMBER_SIZE = 28;

// Карточка «Как сделать»: пронумерованные способы и совет.
export function HowtoCardView({ card }: HowtoCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.howto")} />

      {card.methods.map((method, index) => (
        <View key={method.title} style={styles.method}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.methodTexts}>
            <Text style={styles.methodTitle}>{method.title}</Text>
            <Text style={styles.methodText}>{method.text}</Text>
          </View>
        </View>
      ))}

      <LessonHighlight title={t("lesson.labels.tip")} text={card.tip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  method: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  number: {
    width: NUMBER_SIZE,
    height: NUMBER_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  methodTexts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  methodTitle: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  methodText: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
});
