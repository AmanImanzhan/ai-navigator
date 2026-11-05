import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useAppStore, useHasHydrated } from "@/store/useAppStore";

// Не убираем заставку сами — уберём, когда загрузятся сохранённые данные.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = useHasHydrated();
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  useEffect(() => {
    if (hydrated) SplashScreen.hide();
  }, [hydrated]);

  // Пока данные грузятся, видна заставка — экран выбора языка не мелькает.
  if (!hydrated) return null;

  // Protected: экраны внутри доступны, только когда guard = true.
  // Если guard ложный — отправляем на "/", а распределитель в index.tsx решает, куда дальше.
  // Сам "/" не защищён, поэтому он есть всегда.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!onboardingDone} redirectTo="/">
        <Stack.Screen name="onboarding/language" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="onboarding/work" />
        <Stack.Screen name="onboarding/time" />
      </Stack.Protected>

      <Stack.Protected guard={onboardingDone} redirectTo="/">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]/index" />
        <Stack.Screen name="lesson/[id]/complete" />
      </Stack.Protected>
    </Stack>
  );
}
