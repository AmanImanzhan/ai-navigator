import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { PlanOption } from "@/components/premium/PlanOption";
import i18n from "@/i18n";
import type { PaywallPlan } from "@/lib/purchases";

// Тариф на экране оплаты: цена из App Store, пробный период — только если он доступен.

function plan(fields: Partial<PaywallPlan>): PaywallPlan {
  return {
    pkg: {} as PaywallPlan["pkg"],
    period: "annual",
    priceString: "$19.99",
    pricePerMonthString: "$1.67",
    trial: null,
    ...fields,
  };
}

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("PlanOption", () => {
  it("annual: price per year, per month and savings", async () => {
    await render(<PlanOption plan={plan({})} selected savingsPercent={44} onPress={() => {}} />);
    expect(screen.getByText("Yearly")).toBeOnTheScreen();
    expect(screen.getByText("$19.99 per year")).toBeOnTheScreen();
    expect(screen.getByText("≈ $1.67 per month")).toBeOnTheScreen();
    expect(screen.getByText("Save 44%")).toBeOnTheScreen();
  });

  it("no trial text when Apple does not offer a trial to this Apple ID", async () => {
    await render(
      <PlanOption plan={plan({ trial: null })} selected={false} savingsPercent={null} onPress={() => {}} />,
    );
    expect(screen.queryByText(/free/)).toBeNull();
  });

  it("trial text with the price that will be charged after it", async () => {
    await render(
      <PlanOption
        plan={plan({ period: "monthly", priceString: "$2.99", pricePerMonthString: null, trial: { count: 3, unit: "DAY" } })}
        selected={false}
        savingsPercent={null}
        onPress={() => {}}
      />,
    );
    expect(screen.getByText("3 days free, then $2.99 per month")).toBeOnTheScreen();
  });

  it("Russian plural forms for the trial", async () => {
    await i18n.changeLanguage("ru");
    await render(
      <PlanOption plan={plan({ trial: { count: 3, unit: "DAY" } })} selected={false} savingsPercent={null} onPress={() => {}} />,
    );
    expect(screen.getByText(/^3 дня/)).toBeOnTheScreen();
  });

  it("is a radio button for VoiceOver and reports presses", async () => {
    const onPress = jest.fn();
    await render(<PlanOption plan={plan({})} selected savingsPercent={null} onPress={onPress} />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeChecked();
    expect(radio.props.accessibilityLabel).toContain("$19.99 per year");
    await fireEvent.press(radio);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
