import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/BackHeader";
import { LessonHighlight } from "@/components/lesson/LessonHighlight";
import { LessonChips } from "@/components/library/LessonChips";
import { useLibraryConcept } from "@/hooks/useLibrary";
import { theme } from "@/theme";

// Экран понятия в Справочнике: объяснение, пример и уроки, где оно встречается.
export default function LibraryConceptScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const concept = useLibraryConcept(id);

  if (!concept) {
    return (
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <BackHeader fallback="/library" />
          <Text style={styles.title}>{t("library.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader fallback="/library" />
        <Text style={styles.title}>{concept.title}</Text>
        <Text style={styles.body}>{concept.text}</Text>
        <LessonHighlight title={t("library.example")} text={concept.example} />

        <View style={styles.block}>
          <Text style={styles.label}>{t("library.inLessons")}</Text>
          <LessonChips lessonIds={concept.lessonIds} />
        </View>
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
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  block: {
    gap: theme.spacing.xs,
  },
  label: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
});
