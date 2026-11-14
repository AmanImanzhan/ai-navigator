// Чистая функция: какие напоминания запланировать. Без уведомлений и хранилищ —
// поэтому её легко проверить тестом. Само планирование — в lib/reminders/index.ts.
//
// Почему не одно ежедневное уведомление, а семь еженедельных (по дню недели):
// - повторяющееся уведомление нельзя пропустить один раз, а нам нужно не напоминать,
//   если сегодня урок уже пройден. Вместо сегодняшнего дня недели ставим разовое
//   уведомление ровно через неделю — остальные шесть дней продолжают повторяться;
// - у каждого дня недели свой текст — напоминания не звучат одинаково.

export type ReminderTime = {
  hour: number;
  minute: number;
};

// День недели как в expo-notifications: 1 — воскресенье … 7 — суббота.
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PlannedReminder =
  // Каждую неделю в этот день недели.
  | { kind: "weekly"; weekday: Weekday; hour: number; minute: number }
  // Один раз в конкретную дату.
  | { kind: "once"; weekday: Weekday; date: Date };

const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5, 6, 7];

export function weekdayOf(date: Date): Weekday {
  return (date.getDay() + 1) as Weekday;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// lastLessonAt — когда последний раз прошли урок (миллисекунды) или null.
export function planReminders(
  now: Date,
  time: ReminderTime,
  lastLessonAt: number | null,
): PlannedReminder[] {
  const today = weekdayOf(now);
  const studiedToday =
    lastLessonAt !== null && isSameDay(new Date(lastLessonAt), now);

  return WEEKDAYS.map((weekday): PlannedReminder => {
    if (weekday === today && studiedToday) {
      // Сегодня уже занимались — сегодня не напоминаем; следующий раз через неделю.
      // Когда человек снова откроет приложение, этот день опять станет еженедельным.
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(time.hour, time.minute, 0, 0);
      return { kind: "once", weekday, date: nextWeek };
    }
    return { kind: "weekly", weekday, hour: time.hour, minute: time.minute };
  });
}
