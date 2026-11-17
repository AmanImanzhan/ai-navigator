// Делит поток ответа ИИ на две части по строке-маркеру: «ответ» и «разбор запроса».
// Маркер может прийти кусками в разных частях потока («[[REV» + «IEW]]») — поэтому
// хвост, похожий на начало маркера, придерживаем, пока не станет ясно, маркер это или нет.

export type SplitPart = { type: "answer" | "review"; text: string };

export class ReviewSplitter {
  private state: "answer" | "review" = "answer";
  private buffer = "";
  // Пробелы и переносы сразу после маркера в разбор не отправляем.
  private reviewStarted = false;

  constructor(private readonly marker: string) {}

  push(text: string): SplitPart[] {
    if (this.state === "review") return this.review(text);

    this.buffer += text;
    const index = this.buffer.indexOf(this.marker);
    if (index >= 0) {
      const answer = this.buffer.slice(0, index);
      const rest = this.buffer.slice(index + this.marker.length);
      this.buffer = "";
      this.state = "review";
      return [...this.answer(answer), ...this.review(rest)];
    }

    // Придерживаем хвост, который может оказаться началом маркера.
    const keep = this.partialMarkerLength(this.buffer);
    const ready = this.buffer.slice(0, this.buffer.length - keep);
    this.buffer = this.buffer.slice(this.buffer.length - keep);
    return this.answer(ready);
  }

  // Поток закончился: отдаём то, что придерживали.
  flush(): SplitPart[] {
    const rest = this.buffer;
    this.buffer = "";
    return this.state === "answer" ? this.answer(rest) : [];
  }

  private answer(text: string): SplitPart[] {
    return text ? [{ type: "answer", text }] : [];
  }

  private review(text: string): SplitPart[] {
    let out = text;
    if (!this.reviewStarted) {
      out = out.replace(/^\s+/, "");
      if (out) this.reviewStarted = true;
    }
    return out ? [{ type: "review", text: out }] : [];
  }

  // Длина самого длинного конца строки, который совпадает с началом маркера.
  private partialMarkerLength(text: string): number {
    const max = Math.min(text.length, this.marker.length - 1);
    for (let length = max; length > 0; length--) {
      if (this.marker.startsWith(text.slice(-length))) return length;
    }
    return 0;
  }
}
