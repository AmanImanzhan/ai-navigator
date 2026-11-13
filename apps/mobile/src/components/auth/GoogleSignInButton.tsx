import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { BUTTON_HEIGHT } from "@/components/Button";
import { theme } from "@/theme";

// Размер логотипа «G». По брендбуку его нельзя растягивать и перекрашивать.
const LOGO_SIZE = 20;

type GoogleSignInButtonProps = {
  onPress: () => void;
};

// Кнопка «Продолжить с Google» по брендбуку Google (светлая тема):
// белый фон, серая рамка 1px, тёмный текст, цветной логотип «G» слева.
// Высота и скругление — как у кнопки Apple, чтобы обе выглядели равнозначно.
export function GoogleSignInButton({ onPress }: GoogleSignInButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("auth.continueWithGoogle")}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Image
        source={require("@/assets/images/google-g.svg")}
        style={styles.logo}
        contentFit="contain"
        accessible={false}
      />
      <Text style={styles.title}>{t("auth.continueWithGoogle")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.googleButtonBorder,
    backgroundColor: theme.colors.googleButtonBg,
  },
  pressed: {
    opacity: 0.85,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.googleButtonText,
  },
});
