import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Подключаем переводы до первого экрана.
import "@/i18n";
import { useAppleRevocation } from "@/hooks/useAppleRevocation";
import { useContentSync } from "@/hooks/useContentSync";
import { usePurchasesSetup } from "@/hooks/usePremium";
import { useReminders } from "@/hooks/useReminders";
import { useSync } from "@/hooks/useSync";
import { useAppStore, useHasHydrated } from "@/store/useAppStore";
import { listenToAuthChanges } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";

// Не убираем заставку сами — уберём, когда загрузятся сохранённые данные.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appHydrated = useHasHydrated();
  const contentHydrated = useContentStore((state) => state.hydrated);
  const hydrated = appHydrated && contentHydrated;
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  // Уроки и шаблоны из Supabase: сначала кэш, свежие данные — в фоне.
  useContentSync(hydrated);

  // Вход: следим за сессией, пока приложение открыто.
  useEffect(() => listenToAuthChanges(), []);

  // Прогресс и запросы вошедшего — в аккаунт и обратно.
  useSync(appHydrated);

  // Подписка (RevenueCat): покупатель = вошедший аккаунт Supabase.
  usePurchasesSetup();

  // Напоминания: расписание и открытие Главной по нажатию.
  useReminders(hydrated);

  // Отключили «Вход с Apple» в настройках iPhone — выходим из аккаунта.
  useAppleRevocation(hydrated);

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
      {/* Вход: «Сохраните прогресс» после первого урока и «У меня уже есть аккаунт».
          Вне Protected — доступен и до онбординга, и после. */}
      <Stack.Screen
        name="save-progress"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetGrabberVisible: true,
        }}
      />

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
        <Stack.Screen name="template/[id]/index" />
        <Stack.Screen name="template/[id]/fill" />
        <Stack.Screen name="library/tool/[id]" />
        <Stack.Screen name="library/concept/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="delete-account" />
        {/* Выбор языка из Профиля — шторка снизу высотой по содержимому. */}
        <Stack.Screen
          name="language-picker"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: "fitToContents",
            sheetGrabberVisible: true,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
