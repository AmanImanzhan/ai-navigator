import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

type ProgressBarProps = {
  // От 0 (пусто) до 1 (заполнено полностью).
  progress: number;
};

const HEIGHT = 6;

export function ProgressBar({ progress }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: HEIGHT,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.track,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
  },
});
