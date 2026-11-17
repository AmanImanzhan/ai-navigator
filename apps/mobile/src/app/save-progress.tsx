import { router, useLocalSearchParams } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { SignInButtons } from "@/components/auth/SignInButtons";
import { Button } from "@/components/Button";
import { theme } from "@/theme";

// Размер круга со значком облака.
const ICON_CIRCLE_SIZE = 56;

// Шторка входа. Три режима:
// - обычный: «Сохраните прогресс» — после первого урока;
// - mode=signIn: «Войдите в аккаунт» — с приветствия, по кнопке «У меня уже есть аккаунт»;
// - mode=ai: «Войдите, чтобы спросить AI» — из ИИ-помощника в уроке или шаблоне.
// Без аккаунта приложение работает как раньше — шторку можно просто закрыть.
export default function SaveProgress() {
  const { t } = useTranslation();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSignIn = mode === "signIn";
  const isAi = mode === "ai";

  const icon: SymbolViewProps["name"] = isAi
    ? { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }
    : isSignIn
      ? {
          ios: "person.crop.circle",
          android: "account_circle",
          web: "account_circle",
        }
      : {
          ios: "icloud.and.arrow.up",
          android: "cloud_upload",
          web: "cloud_upload",
        };
  const title = isAi
    ? t("auth.aiTitle")
    : isSignIn
      ? t("auth.signInTitle")
      : t("auth.saveTitle");
  const text = isAi
    ? t("auth.aiText")
    : isSignIn
      ? t("auth.signInText")
      : t("auth.saveText");

  return (
    <View style={styles.sheet}>
      <View style={styles.iconCircle}>
        <SymbolView
          name={icon}
          size={28}
          tintColor={theme.colors.accent}
        />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{text}</Text>
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

      {isSignIn || isAi ? null : (
        <Text style={styles.note}>{t("auth.saveNote")}</Text>
      )}
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
