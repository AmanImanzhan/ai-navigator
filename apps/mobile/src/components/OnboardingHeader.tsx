import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { theme } from "@/theme";

type OnboardingHeaderProps = {
  step: number;
  total: number;
};

const BACK_SIZE = 44;

// Верх экранов онбординга: «назад», полоска прогресса и «2 из 3».
export function OnboardingHeader({ step, total }: OnboardingHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
      >
        <SymbolView
          name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
          size={20}
          weight="semibold"
          tintColor={theme.colors.text}
        />
      </Pressable>

      <View style={styles.progress}>
        <ProgressBar progress={step / total} />
      </View>

      <Text style={styles.label}>
        {step} из {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  back: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    // Сдвигаем влево, чтобы стрелка стояла ровно по краю контента.
    marginLeft: -theme.spacing.sm,
  },
  backPressed: {
    backgroundColor: theme.colors.track,
  },
  progress: {
    flex: 1,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
});
