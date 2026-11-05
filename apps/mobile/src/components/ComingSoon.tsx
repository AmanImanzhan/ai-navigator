import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme";

type ComingSoonProps = {
  title: string;
};

// Заглушка для вкладок, которые ещё не готовы: заголовок и «Скоро».
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Скоро</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
