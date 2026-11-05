import { Redirect } from "expo-router";

import { useAppStore } from "@/store/useAppStore";

// Адрес "/" — распределитель. Он открыт всегда и сразу отправляет дальше:
// онбординг пройден → уроки, иначе → выбор языка.
// К этому моменту данные уже загружены: _layout ждёт их под заставкой.
export default function Index() {
  const onboardingDone = useAppStore((state) => state.onboardingDone);

  return <Redirect href={onboardingDone ? "/home" : "/onboarding/language"} />;
}
