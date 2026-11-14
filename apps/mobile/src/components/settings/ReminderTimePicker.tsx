import { DatePicker, Host } from "@expo/ui/swift-ui";
import { datePickerStyle } from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";

import { useReminderStore } from "@/store/useReminderStore";
import { theme } from "@/theme";

// «06:30», «19:00» — для запасного варианта без нативного выбора.
function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// Выбор времени напоминания. На iOS — нативный выбор времени (SwiftUI DatePicker):
// строка с подписью и временем, по нажатию открывается колесо.
// На других платформах пока только показываем время (публикуем только iOS).
export function ReminderTimePicker() {
  const { t } = useTranslation();
  const hour = useReminderStore((state) => state.hour);
  const minute = useReminderStore((state) => state.minute);
  const setTime = useReminderStore((state) => state.setTime);

  if (Platform.OS !== "ios") {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{t("settings.reminderTime")}</Text>
        <Text style={styles.value}>{formatTime(hour, minute)}</Text>
      </View>
    );
  }

  // DatePicker работает с датой — берём сегодняшнюю с нужными часами и минутами.
  const selection = new Date();
  selection.setHours(hour, minute, 0, 0);

  return (
    <Host
      matchContents={{ vertical: true }}
      seedColor={theme.colors.accent}
      style={styles.host}
    >
      <DatePicker
        title={t("settings.reminderTime")}
        selection={selection}
        displayedComponents={["hourAndMinute"]}
        modifiers={[datePickerStyle("compact")]}
        onDateChange={(date) => setTime(date.getHours(), date.getMinutes())}
      />
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.accent,
  },
});
