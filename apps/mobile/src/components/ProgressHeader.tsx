import { router } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProgressBar } from "@/components/ProgressBar";
import { theme } from "@/theme";

type HeaderButton = "back" | "close";

type ProgressHeaderProps = {
  button: HeaderButton;
  step: number;
  total: number;
};

const BUTTON_SIZE = 44;

// Иконка у каждого вида кнопки. Подпись для экранного диктора — в переводах (common.back / common.close).
const ICONS: Record<HeaderButton, SymbolViewProps["name"]> = {
  back: { ios: "chevron.left", android: "arrow_back", web: "arrow_back" },
  close: { ios: "xmark", android: "close", web: "close" },
};

// Верх экрана с шагами: «назад» или крестик, полоска прогресса и «2 из 3».
// Обе кнопки делают router.back().
export function ProgressHeader({ button, step, total }: ProgressHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t(`common.${button}`)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <SymbolView
          name={ICONS[button]}
          size={20}
          weight="semibold"
          tintColor={theme.colors.text}
        />
      </Pressable>

      <View style={styles.progress}>
        <ProgressBar progress={step / total} />
      </View>

      <Text style={styles.label}>{t("common.stepOf", { step, total })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    // Сдвигаем влево, чтобы иконка стояла ровно по краю контента.
    marginLeft: -theme.spacing.sm,
  },
  pressed: {
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
