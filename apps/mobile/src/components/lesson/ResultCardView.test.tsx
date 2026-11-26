import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react-native";

import { ResultCardView } from "@/components/lesson/ResultCardView";
import "@/i18n";

// «Вот что получится»: картинок у уроков нет — пример результата показывается текстом
// в карточке, без пустой серой рамки под картинку.

describe("ResultCardView", () => {
  it("shows the example result as text inside the preview card", async () => {
    await render(
      <ResultCardView card={{ type: "result", text: "Three recipes from your fridge." }} />,
    );

    expect(screen.getByText("Here's what you'll make")).toBeOnTheScreen();
    const preview = screen.getByTestId("result-preview");
    expect(within(preview).getByText("Three recipes from your fridge.")).toBeOnTheScreen();
  });

  it("shows the title inside the preview card when there is one", async () => {
    await render(
      <ResultCardView
        card={{ type: "result", title: "A birthday card for Mom", text: "Spring flowers." }}
      />,
    );

    const preview = screen.getByTestId("result-preview");
    expect(within(preview).getByText("A birthday card for Mom")).toBeOnTheScreen();
    expect(within(preview).getByText("Spring flowers.")).toBeOnTheScreen();
  });

  it("has no empty image placeholder: the preview card holds only the texts", async () => {
    await render(<ResultCardView card={{ type: "result", text: "A plain explanation." }} />);

    expect(screen.getByTestId("result-preview").children).toHaveLength(1);
  });
});
