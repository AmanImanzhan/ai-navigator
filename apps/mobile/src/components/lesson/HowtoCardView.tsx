import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonLabel } from "@/components/lesson/LessonLabel";
import type { HowtoCard, HowtoItem } from "@/data/lessons";
import { theme } from "@/theme";

type HowtoCardViewProps = {
  card: HowtoCard;
};

const NUMBER_SIZE = 28;
const BULLET_SIZE = 6;

// Карточка «Как сделать». Три вида списка:
// options — способы на выбор, каждый в своей карточке;
// steps — шаги по порядку с номерами; list — простой список с точками.
export function HowtoCardView({ card }: HowtoCardViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LessonLabel text={card.label ?? t("lesson.labels.howto")} />
      {card.intro ? <Text style={styles.intro}>{card.intro}</Text> : null}

      <View style={card.layout === "options" ? styles.options : styles.rows}>
        {card.items.map((item, index) => (
          <HowtoRow
            key={index}
            item={item}
            index={index}
            layout={card.layout}
          />
        ))}
      </View>

      {card.note ? <LessonHighlight text={card.note} /> : null}
    </View>
  );
}

type HowtoRowProps = {
  item: HowtoItem;
  index: number;
  layout: HowtoCard["layout"];
};

function HowtoRow({ item, index, layout }: HowtoRowProps) {
  const marker =
    layout === "list" ? (
      <View style={styles.bulletBox}>
        <View style={styles.bullet} />
      </View>
    ) : (
      <View style={styles.number}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
    );

  return (
    <View style={layout === "options" ? styles.optionCard : styles.row}>
      {marker}
      <View style={styles.texts}>
        {item.title ? <Text style={styles.itemTitle}>{item.title}</Text> : null}
        <Text style={item.title ? styles.itemText : styles.itemTextOnly}>
          {item.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  intro: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  options: {
    gap: theme.spacing.sm,
  },
  rows: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  optionCard: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
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
  // Точка по центру первой строки текста.
  bulletBox: {
    height: theme.typography.body.lineHeight,
    justifyContent: "center",
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  itemTitle: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  itemText: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  itemTextOnly: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
