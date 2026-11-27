import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react-native";

import { LessonCover } from "@/components/lesson/LessonCover";
import { getLesson, type ResultCard } from "@/data/lessons";
import "@/i18n";

// Обложка урока: надзаголовок с направлением, название, время и уровень,
// затем вступление — всё из данных урока.

const lesson1 = getLesson("1", "en");
if (!lesson1?.content) throw new Error("lesson 1 must have content");
const result = lesson1.content.cards[0] as ResultCard;

describe("LessonCover", () => {
  it("shows the track, the title and the time/level chips", async () => {
    await render(
      <LessonCover lesson={lesson1} track={{ id: "texts", title: "Writing" }} result={result} />,
    );

    expect(screen.getByText("Writing")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: lesson1.title })).toBeOnTheScreen();
    expect(screen.getByText(`${lesson1.minutes} min`)).toBeOnTheScreen();
    expect(screen.getByText(`Level ${lesson1.level}`)).toBeOnTheScreen();
  });

  it("shows the result text as the lesson intro, with no label or steps block", async () => {
    await render(<LessonCover lesson={lesson1} result={result} />);

    expect(within(screen.getByTestId("lesson-lead")).getByText(result.text)).toBeOnTheScreen();
    expect(screen.queryByText("Here's what you'll make")).toBeNull();
    expect(screen.queryByText("In this lesson")).toBeNull();
  });

  it("works without a track: no eyebrow, the title is still there", async () => {
    await render(<LessonCover lesson={lesson1} result={result} />);

    expect(screen.queryByText("Writing")).toBeNull();
    expect(screen.getByRole("header", { name: lesson1.title })).toBeOnTheScreen();
  });
});
