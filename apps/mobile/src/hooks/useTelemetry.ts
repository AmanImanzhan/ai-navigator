import { useNavigationContainerRef, usePathname } from "expo-router";
import { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  identify,
  reset,
  screen,
  setAnalyticsEnabled,
  track,
} from "@/lib/analytics";
import {
  initMonitoring,
  navigationIntegration,
  setMonitoringUser,
} from "@/lib/monitoring";
import { useAppStore } from "@/store/useAppStore";
import {
  useTelemetryHydrated,
  useTelemetryStore,
} from "@/store/useTelemetryStore";

// Статистика и отчёты об ошибках: включение, кто вошёл, просмотры экранов.
// Подключается один раз в корневом layout. Пока согласие не прочитано с телефона — ничего не делаем.
export function useTelemetrySetup(): void {
  const hydrated = useTelemetryHydrated();
  const enabled = useTelemetryStore((state) => state.enabled);
  const { user, initialized: authReady } = useAuth();
  const userId = user?.id ?? null;
  const language = useAppStore((state) => state.language);
  const pathname = usePathname();
  const navigationRef = useNavigationContainerRef();

  // Включение и выключение по переключателю «Помогать улучшать приложение».
  useEffect(() => {
    if (!hydrated) return;
    if (enabled) initMonitoring();
    setAnalyticsEnabled(enabled);
  }, [hydrated, enabled]);

  // Навигация для Sentry: в отчёте видно, на каком экране ошибка.
  useEffect(() => {
    if (hydrated && enabled && navigationRef) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [hydrated, enabled, navigationRef]);

  // Запуск приложения — один раз.
  const opened = useRef(false);
  useEffect(() => {
    if (!hydrated || opened.current) return;
    opened.current = true;
    track("app_opened", { language });
  }, [hydrated, language]);

  // Вошёл — id Supabase; вышел — новый анонимный id. Без почты и имени.
  const lastUserId = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated || !authReady) return;
    setMonitoringUser(userId);
    if (userId) {
      identify(userId);
    } else if (lastUserId.current) {
      reset();
    }
    lastUserId.current = userId;
  }, [hydrated, authReady, userId, enabled]);

  // Просмотры экранов: только путь (/lesson/4), без параметров.
  useEffect(() => {
    if (hydrated) screen(pathname);
  }, [hydrated, pathname]);
}
