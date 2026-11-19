import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PaywallPlan } from "@/lib/purchases";
import { theme } from "@/theme";

// Размер кружка выбора.
const RADIO_SIZE = 22;

type PlanOptionProps = {
  plan: PaywallPlan;
  selected: boolean;
  // Для годового: на сколько процентов выгоднее помесячной оплаты.
  savingsPercent: number | null;
  onPress: () => void;
};

// Цена за период — главная цифра (её и спишут): «$19.99 в год».
function priceText(t: TFunction, plan: PaywallPlan): string {
  return plan.period === "annual"
    ? t("premium.perYear", { price: plan.priceString })
    : t("premium.perMonth", { price: plan.priceString });
}

const TRIAL_UNIT_KEYS = {
  DAY: "trialDays",
  WEEK: "trialWeeks",
  MONTH: "trialMonths",
  YEAR: "trialYears",
} as const;

// «3 дня бесплатно, затем $19.99 в год» — только если пробный период доступен этому Apple ID.
export function trialText(t: TFunction, plan: PaywallPlan): string | null {
  if (!plan.trial) return null;
  return t("premium.trial", {
    period: t(`premium.${TRIAL_UNIT_KEYS[plan.trial.unit]}`, {
      count: plan.trial.count,
    }),
    price: priceText(t, plan),
  });
}

// Один тариф: «Год — $19.99 в год, ≈ $1.66 в месяц, выгоднее на 44%».
// Для VoiceOver — переключатель (radio) с понятным описанием.
export function PlanOption({
  plan,
  selected,
  savingsPercent,
  onPress,
}: PlanOptionProps) {
  const { t } = useTranslation();
  const title =
    plan.period === "annual" ? t("premium.planAnnual") : t("premium.planMonthly");
  const price = priceText(t, plan);
  const perMonth = plan.pricePerMonthString
    ? t("premium.annualPerMonth", { price: plan.pricePerMonthString })
    : null;
  const savings =
    savingsPercent !== null ? t("premium.savings", { percent: savingsPercent }) : null;
  const trial = trialText(t, plan);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={[title, price, perMonth, savings, trial]
        .filter(Boolean)
        .join(". ")}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>

      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {savings ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{savings}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>{price}</Text>
        {perMonth ? <Text style={styles.secondary}>{perMonth}</Text> : null}
        {trial ? <Text style={styles.trial}>{trial}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  cardSelected: {
    borderColor: theme.colors.accent,
  },
  pressed: {
    backgroundColor: theme.colors.track,
  },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    marginTop: theme.spacing.xxs,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: theme.colors.accent,
  },
  radioDot: {
    width: RADIO_SIZE / 2,
    height: RADIO_SIZE / 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
  },
  badge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
  },
  badgeText: {
    ...theme.typography.label,
    color: theme.colors.accent,
  },
  price: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  secondary: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
  },
  trial: {
    ...theme.typography.callout,
    color: theme.colors.success,
  },
});
