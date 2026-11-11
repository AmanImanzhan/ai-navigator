import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LessonLabel } from "@/components/lesson/LessonLabel";
import { OpenToolButton } from "@/components/lesson/OpenToolButton";
import type { ToolCard } from "@/data/lessons";
import { getLibraryToolId } from "@/data/library";
import { theme } from "@/theme";

type ToolCardViewProps = {
  card: ToolCard;
};

// Карточка «Какой инструмент»: названия крупно, пояснение и кнопка на каждый инструмент.
// Первый инструмент — главный, его кнопка ярче. Ниже — ссылки на страницы инструментов в Справочнике.
export function ToolCardView({ card }: ToolCardViewProps) {
  const { t } = useTranslation();

  // Только инструменты, у которых есть страница в Справочнике.
  const libraryLinks = card.tools.flatMap((tool) => {
    const id = getLibraryToolId(tool.url);
    return id ? [{ id, name: tool.name }] : [];
  });

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

      {libraryLinks.length > 0 ? (
        <View style={styles.more}>
          <Text style={styles.moreLabel}>{t("lesson.moreAbout")}</Text>
          {libraryLinks.map((link) => (
            <Pressable
              key={link.id}
              onPress={() =>
                router.push({
                  pathname: "/library/tool/[id]",
                  params: { id: link.id },
                })
              }
              accessibilityRole="link"
              hitSlop={8}
            >
              <Text style={styles.moreLink}>{link.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
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
  more: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.xxs,
    marginTop: theme.spacing.xs,
  },
  moreLabel: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  moreLink: {
    ...theme.typography.callout,
    color: theme.colors.accent,
    textDecorationLine: "underline",
  },
});
