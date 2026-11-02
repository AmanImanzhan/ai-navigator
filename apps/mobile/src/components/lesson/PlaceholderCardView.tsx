import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

// Временная заглушка для карточек quiz и practice.
export function PlaceholderCardView() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>
        Эта карточка появится в следующей задаче
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
