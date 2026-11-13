import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { SignInButtons } from "@/components/auth/SignInButtons";
import { Button } from "@/components/Button";
import { theme } from "@/theme";

// Размер круга со значком облака.
const ICON_CIRCLE_SIZE = 56;

// Шторка «Сохраните прогресс»: зачем входить, кнопки входа и «Не сейчас».
// Без аккаунта приложение работает как раньше — шторку можно просто закрыть.
export default function SaveProgress() {
  const { t } = useTranslation();

  return (
    <View style={styles.sheet}>
      <View style={styles.iconCircle}>
        <SymbolView
          name={{
            ios: "icloud.and.arrow.up",
            android: "cloud_upload",
            web: "cloud_upload",
          }}
          size={28}
          tintColor={theme.colors.accent}
        />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{t("auth.saveTitle")}</Text>
        <Text style={styles.body}>{t("auth.saveText")}</Text>
      </View>

      <View style={styles.actions}>
        <SignInButtons onSignedIn={() => router.back()} />
        <Button
          title={t("auth.notNow")}
          variant="ghost"
          onPress={() => router.back()}
        />
      </View>

      <Text style={styles.note}>{t("auth.saveNote")}</Text>
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
