import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/BackHeader";
import { Button } from "@/components/Button";
import { BulletList } from "@/components/library/BulletList";
import { LessonChips } from "@/components/library/LessonChips";
import { useLibraryTool } from "@/hooks/useLibrary";
import { theme } from "@/theme";

// Номер месяца без нуля впереди: "1" … "12" — как ключи в переводах.
type MonthNumber =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

// Экран инструмента в Справочнике.
export default function LibraryToolScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = useLibraryTool(id);

  if (!tool) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <BackHeader fallback="/library" />
          <Text style={styles.title}>{t("library.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // "2026-11-11" → «ноябрь 2026». Месяцы — из переводов, чтобы текст был одинаковым на всех телефонах.
  const [year, month] = tool.checkedAt.split("-");
  const monthKey = String(Number(month)) as MonthNumber;
  const checkedAt = t("library.checkedAt", {
    month: t(`library.months.${monthKey}`),
    year,
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader fallback="/library" />

        <View style={styles.heading}>
          <Text style={styles.category}>{tool.categoryTitle}</Text>
          <Text style={styles.title}>{tool.name}</Text>
          <Text style={styles.body}>{tool.about}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("library.strengths")}</Text>
          <BulletList items={tool.strengths} />
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("library.free")}</Text>
          <Text style={styles.body}>{tool.free}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("library.notes")}</Text>
          <BulletList items={tool.notes} />
        </View>

        <Button
          title={t("library.openSite")}
          onPress={() => WebBrowser.openBrowserAsync(tool.url)}
        />

        <View style={styles.block}>
          <Text style={styles.label}>{t("library.inLessons")}</Text>
          <LessonChips lessonIds={tool.lessonIds} />
        </View>

        <Text style={styles.checked}>{checkedAt}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  heading: {
    gap: theme.spacing.xs,
  },
  category: {
    ...theme.typography.label,
    color: theme.colors.accent,
    textTransform: "uppercase",
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  block: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  checked: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
