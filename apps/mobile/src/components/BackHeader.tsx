import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { theme } from "@/theme";

const BUTTON_SIZE = 44;

// Верх экрана с кнопкой «назад». Если возвращаться некуда (открыли по ссылке) — ведёт во вкладку «Запросы».
export function BackHeader() {
  const { t } = useTranslation();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/prompts");
    }
  }

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel={t("common.back")}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <SymbolView
          name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
          size={20}
          weight="semibold"
          tintColor={theme.colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
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
});
