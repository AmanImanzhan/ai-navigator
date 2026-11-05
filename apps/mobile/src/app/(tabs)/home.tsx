import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonRow } from "@/components/LessonRow";
import { getLessonStatus } from "@/data/lessons";
import { useTracks } from "@/hooks/useLessons";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Вкладка «Уроки»: направления и их уроки.
export default function Home() {
  const { t } = useTranslation();
  const tracks = useTracks();
  const completedLessons = useAppStore((state) => state.completedLessons);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("lessons.title")}</Text>

        {tracks.map((track) => (
          <View key={track.id} style={styles.section}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <View style={styles.lessons}>
              {track.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  status={getLessonStatus(
                    lesson,
                    track,
                    completedLessons.includes(lesson.id),
                  )}
                  onPress={() =>
                    router.push({
                      pathname: "/lesson/[id]",
                      params: { id: lesson.id },
                    })
                  }
                />
              ))}
            </View>
          </View>
        ))}
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
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  section: {
    gap: theme.spacing.sm,
  },
  trackTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  lessons: {
    gap: theme.spacing.xs,
  },
});
