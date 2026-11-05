import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import { OpenToolButton } from "@/components/lesson/OpenToolButton";
import type { ToolCard } from "@/data/lessons";
import { theme } from "@/theme";

type ToolCardViewProps = {
  card: ToolCard;
};

// Карточка «Какой инструмент»: названия крупно, пояснение и кнопка на каждый инструмент.
// Первый инструмент — главный, его кнопка ярче.
export function ToolCardView({ card }: ToolCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={t("lesson.labels.tool")} />
      <Text style={styles.name}>
        {card.tools.map((tool) => tool.name).join(" · ")}
      </Text>
      <Text style={styles.text}>{card.text}</Text>
      <View style={styles.actions}>
        {card.tools.map((tool, index) => (
          <OpenToolButton
            key={tool.url}
            tool={tool}
            variant={index === 0 ? "primary" : "secondary"}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  name: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
