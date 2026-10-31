import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { theme } from "@/theme";

// Временный демо-экран приветствия для проверки темы и кнопок.
export default function Index() {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text style={styles.title}>AI — это просто</Text>
        <Text style={styles.body}>
          Короткие практичные уроки помогут вам начать пользоваться
          AI-инструментами уже сегодня.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Начать" onPress={() => {}} />
        <Button
          title="У меня уже есть аккаунт"
          variant="ghost"
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actions: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
});
