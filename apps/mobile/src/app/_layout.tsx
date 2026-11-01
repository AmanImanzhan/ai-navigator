import { Stack } from "expo-router";

export default function RootLayout() {
  // Скрываем белую шапку сразу для всех экранов.
  return <Stack screenOptions={{ headerShown: false }} />;
}
