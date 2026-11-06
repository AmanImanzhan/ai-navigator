import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type Segment<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Переключатель из нескольких вариантов, например «Шаблоны / Мои».
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: theme.spacing.xxs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.track,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  segmentSelected: {
    backgroundColor: theme.colors.card,
  },
  label: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  labelSelected: {
    ...theme.typography.headline,
    fontSize: theme.typography.callout.fontSize,
    lineHeight: theme.typography.callout.lineHeight,
    color: theme.colors.text,
  },
});
