import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { SignInButtons } from "@/components/auth/SignInButtons";
import { Button } from "@/components/Button";
import { theme } from "@/theme";

// Размер круга со значком облака.
const ICON_CIRCLE_SIZE = 56;

// Шторка входа. Два режима:
// - обычный: «Сохраните прогресс» — после первого урока;
// - mode=signIn: «Войдите в аккаунт» — с приветствия, по кнопке «У меня уже есть аккаунт».
// Без аккаунта приложение работает как раньше — шторку можно просто закрыть.
export default function SaveProgress() {
  const { t } = useTranslation();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSignIn = mode === "signIn";

  return (
    <View style={styles.sheet}>
      <View style={styles.iconCircle}>
        <SymbolView
          name={{
            ios: isSignIn ? "person.crop.circle" : "icloud.and.arrow.up",
            android: isSignIn ? "account_circle" : "cloud_upload",
            web: isSignIn ? "account_circle" : "cloud_upload",
          }}
          size={28}
          tintColor={theme.colors.accent}
        />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>
          {isSignIn ? t("auth.signInTitle") : t("auth.saveTitle")}
        </Text>
        <Text style={styles.body}>
          {isSignIn ? t("auth.signInText") : t("auth.saveText")}
        </Text>
      </View>

      {/* После входа данные подтянутся сами (lib/sync). Если в аккаунте пройден онбординг —
          приложение само откроет уроки. */}
      <View style={styles.actions}>
        <SignInButtons onSignedIn={() => router.back()} />
        <Button
          title={t("auth.notNow")}
          variant="ghost"
          onPress={() => router.back()}
        />
      </View>

      {isSignIn ? null : <Text style={styles.note}>{t("auth.saveNote")}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.bg,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentSubtle,
  },
  texts: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actions: {
    gap: theme.spacing.xs,
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
