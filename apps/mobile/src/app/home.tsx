import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme";

// Временная главная. Настоящую сделаем позже.
export default function Home() {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <Text style={styles.title}>Главная — скоро</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
});
