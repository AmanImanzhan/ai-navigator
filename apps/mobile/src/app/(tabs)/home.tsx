import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonRow } from "@/components/LessonRow";
import { getLessonStatus, TRACKS } from "@/data/lessons";
import { theme } from "@/theme";

// Вкладка «Уроки»: направления и их уроки.
export default function Home() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Уроки</Text>

        {TRACKS.map((track) => (
          <View key={track.id} style={styles.section}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <View style={styles.lessons}>
              {track.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  status={getLessonStatus(lesson, track)}
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
