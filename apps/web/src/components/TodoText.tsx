const TODO_PATTERN = /(\[TODO:[^\]]*\])/;

type TodoTextProps = {
  text: string;
};

// Текст, в котором пометки «[TODO: …]» подсвечены — так в черновиках видно, что ещё заполнить.
export function TodoText({ text }: TodoTextProps) {
  return text
    .split(TODO_PATTERN)
    .filter((part) => part.length > 0)
    .map((part, index) =>
      TODO_PATTERN.test(part) ? (
        <mark key={index} className="todo">
          {part}
        </mark>
      ) : (
        part
      ),
    );
}
