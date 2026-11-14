import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InfoCard } from "@/components/InfoCard";
import { ListRow } from "@/components/ListRow";
import { useAuth } from "@/hooks/useAuth";
import { getDisplayName } from "@/lib/auth";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Вкладка «Профиль»: кто вы и как продвигаетесь. Всё, что меняется, — в Настройках.
export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const occupation = useAppStore((state) => state.occupation);
  const completedCount = useAppStore((state) => state.completedLessons.length);
  const savedCount = useAppStore((state) => state.savedPrompts.length);

  const occupationTitle = occupation
    ? t(`onboarding.work.options.${occupation}.title`)
    : t("profile.notSelected");

  // Вошёл — под заголовком имя или почта.
  const accountLine = user
    ? (getDisplayName(user) ?? user.email ?? null)
    : null;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("profile.title")}</Text>
          {accountLine ? (
            <Text style={styles.account}>{accountLine}</Text>
          ) : null}
        </View>

        <View style={styles.cards}>
          <InfoCard
            label={t("profile.completed")}
            value={t("profile.lessonsCount", { count: completedCount })}
          />
          <InfoCard
            label={t("profile.saved")}
            value={t("profile.promptsCount", { count: savedCount })}
          />
          <InfoCard label={t("profile.occupation")} value={occupationTitle} />
        </View>

        <ListRow
          title={t("settings.title")}
          subtitle={t("profile.settingsSubtitle")}
          onPress={() => router.push("/settings")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xxs,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  account: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  cards: {
    gap: theme.spacing.xs,
  },
});
