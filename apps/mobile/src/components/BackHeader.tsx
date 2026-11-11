import { router, type Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { theme } from "@/theme";

const BUTTON_SIZE = 44;

type BackHeaderProps = {
  // Куда вести, если возвращаться некуда (экран открыли по ссылке).
  fallback: Href;
};

// Верх экрана с кнопкой «назад».
export function BackHeader({ fallback }: BackHeaderProps) {
  const { t } = useTranslation();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
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
