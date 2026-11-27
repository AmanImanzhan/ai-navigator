import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react-native";

import { ResultCardView } from "@/components/lesson/ResultCardView";
import "@/i18n";

// Карточка result — вступление к уроку: вводный абзац, без подписи «Вот что получится».

describe("ResultCardView", () => {
  it("shows the text as a lead paragraph without a label", async () => {
    await render(
      <ResultCardView card={{ type: "result", text: "Three recipes from your fridge." }} />,
    );

    const lead = screen.getByTestId("lesson-lead");
    expect(within(lead).getByText("Three recipes from your fridge.")).toBeOnTheScreen();
    expect(screen.queryByText("Here's what you'll make")).toBeNull();
  });

  it("shows the title before the paragraph when there is one", async () => {
    await render(
      <ResultCardView
        card={{ type: "result", title: "A birthday card for Mom", text: "Spring flowers." }}
      />,
    );

    const lead = within(screen.getByTestId("lesson-lead"));
    expect(lead.getByText("A birthday card for Mom")).toBeOnTheScreen();
    expect(lead.getByText("Spring flowers.")).toBeOnTheScreen();
  });
});
