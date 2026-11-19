import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignInButtons } from "@/components/auth/SignInButtons";
import { Button } from "@/components/Button";
import { PlanOption, trialText } from "@/components/premium/PlanOption";
import { showPurchaseMessage } from "@/components/premium/purchaseMessage";
import { waitForServerPremium } from "@/hooks/useAiUsage";
import { useAuth } from "@/hooks/useAuth";
import { usePaywallOffer } from "@/hooks/usePaywallOffer";
import { usePremium } from "@/hooks/usePremium";
import { purchasePlan, restorePurchases, type PaywallPlan } from "@/lib/purchases";
import { openSitePage } from "@/lib/site";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

// Размер круга со значком вверху и кнопки «Закрыть».
const ICON_CIRCLE_SIZE = 56;
const CLOSE_SIZE = 44;

const BENEFITS = ["benefit1", "benefit2", "benefit3", "benefit4"] as const;

// Экран подписки AI Navigator Premium (модальный). Открывается только по действию человека:
// «Больше запросов с Premium» у ИИ-помощника или строка Premium в Настройках.
// Цены, валюта и пробный период — из App Store через RevenueCat, в коде их нет.
// Без давления: крестик всегда виден, никаких таймеров и всплывающих окон. Заранее выбран год —
// он выгоднее, но цена за весь срок показана крупно, а помесячная — мельче.
export default function Paywall() {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const { user } = useAuth();
  const { premium } = usePremium();
  const offer = usePaywallOffer();
  const [selectedPeriod, setSelectedPeriod] = useState<PaywallPlan["period"]>("annual");
  const [busy, setBusy] = useState(false);
  // После покупки: «Спасибо» и ожидание, пока сервер узнает о подписке.
  const [thanks, setThanks] = useState<"waiting" | "ready" | null>(null);

  const plans = offer.status === "ready" ? offer.offer.plans : [];
  const selected =
    plans.find((plan) => plan.period === selectedPeriod) ?? plans[0] ?? null;

  function close() {
    if (router.canGoBack()) router.back();
  }

  // Ждём, пока сервер (webhook RevenueCat) включит лимит 30. Не дождались — не страшно:
  // лимит обновится, когда человек откроет помощник.
  function waitForServer() {
    if (!user) return;
    waitForServerPremium(user.id).finally(() => setThanks("ready"));
  }

  async function handleBuy() {
    if (!selected || busy) return;
    setBusy(true);
    const result = await purchasePlan(selected);
    setBusy(false);
    if (result.status === "purchased") {
      setThanks("waiting");
      waitForServer();
      return;
    }
    showPurchaseMessage(t, result);
  }

  async function handleRestore() {
    if (busy) return;
    setBusy(true);
    const result = await restorePurchases();
    setBusy(false);
    if (result.status === "restored" && result.premium) {
      setThanks("waiting");
      waitForServer();
      return;
    }
    showPurchaseMessage(t, result);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={t("premium.close")}
          hitSlop={theme.spacing.xs}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <SymbolView
            name={{ ios: "xmark", android: "close", web: "close" }}
            size={16}
            weight="semibold"
            tintColor={theme.colors.textSecondary}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            size={28}
            tintColor={theme.colors.accent}
          />
        </View>

        {thanks ? (
          <ThanksView waiting={thanks === "waiting"} onDone={close} />
        ) : premium ? (
          <View style={styles.texts}>
            <Text style={styles.title} accessibilityRole="header">
              {t("premium.alreadyTitle")}
            </Text>
            <Text style={styles.body}>{t("premium.alreadyText")}</Text>
            <Button title={t("common.done")} variant="secondary" onPress={close} />
          </View>
        ) : (
          <>
            <View style={styles.texts}>
              <Text style={styles.title} accessibilityRole="header">
                {t("premium.title")}
              </Text>
              <Text style={styles.body}>{t("premium.subtitle")}</Text>
            </View>

            <View style={styles.benefits}>
              {BENEFITS.map((key) => (
                <View key={key} style={styles.benefit}>
                  <SymbolView
                    name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
                    size={20}
                    tintColor={theme.colors.success}
                  />
                  <Text style={styles.benefitText}>{t(`premium.${key}`)}</Text>
                </View>
              ))}
            </View>

            {!user ? (
              // Без входа: сначала аккаунт — подписка привязывается к нему.
              // После входа экран сам покажет тарифы.
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{t("premium.signInTitle")}</Text>
                <Text style={styles.callout}>{t("premium.signInText")}</Text>
                <SignInButtons />
              </View>
            ) : offer.status === "loading" ? (
              <View style={styles.status} accessibilityLiveRegion="polite">
                <ActivityIndicator color={theme.colors.accent} />
                <Text style={styles.callout}>{t("premium.loading")}</Text>
              </View>
            ) : offer.status === "error" || !selected ? (
              <View style={styles.status}>
                <Text style={styles.callout} accessibilityRole="alert">
                  {t("premium.loadError")}
                </Text>
                <Button
                  title={t("premium.retry")}
                  variant="secondary"
                  onPress={offer.reload}
                />
              </View>
            ) : (
              <>
                <View
                  style={styles.plans}
                  accessibilityRole="radiogroup"
                  accessibilityLabel={t("premium.plansLabel")}
                >
                  {plans.map((plan) => (
                    <PlanOption
                      key={plan.period}
                      plan={plan}
                      selected={plan.period === selected.period}
                      savingsPercent={
                        plan.period === "annual"
                          ? offer.offer.annualSavingsPercent
                          : null
                      }
                      onPress={() => setSelectedPeriod(plan.period)}
                    />
                  ))}
                </View>

                <View style={styles.actions}>
                  {busy ? (
                    <ActivityIndicator color={theme.colors.accent} />
                  ) : null}
                  <Button
                    title={
                      trialText(t, selected)
                        ? t("premium.buyTrial")
                        : t("premium.buy")
                    }
                    onPress={handleBuy}
                    disabled={busy}
                  />
                  <Button
                    title={t("premium.restore")}
                    variant="ghost"
                    onPress={handleRestore}
                    disabled={busy}
                  />
                </View>
              </>
            )}

            {/* Обязательно по правилам Apple: автопродление, когда списывается оплата,
                как отменить, ссылки на Условия и Политику. */}
            <Text style={styles.legal}>{t("premium.legal")}</Text>
            <View style={styles.links}>
              <Text
                style={styles.link}
                accessibilityRole="link"
                onPress={() => openSitePage("terms", language)}
              >
                {t("premium.terms")}
              </Text>
              <Text
                style={styles.link}
                accessibilityRole="link"
                onPress={() => openSitePage("privacy", language)}
              >
                {t("premium.privacy")}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type ThanksViewProps = {
  waiting: boolean;
  onDone: () => void;
};

// «Спасибо!» после покупки. Пока сервер включает лимит — короткая подсказка с индикатором.
function ThanksView({ waiting, onDone }: ThanksViewProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.texts}>
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLiveRegion="polite"
      >
        {t("premium.thanksTitle")}
      </Text>
      <Text style={styles.body}>{t("premium.thanksText")}</Text>
      {waiting ? (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <ActivityIndicator color={theme.colors.accent} />
          <Text style={styles.callout}>{t("premium.thanksWaiting")}</Text>
        </View>
      ) : null}
      <Button title={t("common.done")} onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  close: {
    width: CLOSE_SIZE,
    height: CLOSE_SIZE,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.track,
  },
  closePressed: {
    backgroundColor: theme.colors.border,
  },
  content: {
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
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
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  benefits: {
    gap: theme.spacing.sm,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  benefitText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  card: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  callout: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  status: {
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  plans: {
    gap: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.xs,
  },
  legal: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
  },
  link: {
    ...theme.typography.label,
    color: theme.colors.accent,
    textDecorationLine: "underline",
    paddingVertical: theme.spacing.xs,
  },
});
