import { useTranslation } from "react-i18next";

import { ComingSoon } from "@/components/ComingSoon";

// Вкладка «Запросы». Пока заглушка.
export default function Prompts() {
  const { t } = useTranslation();
  return <ComingSoon title={t("tabs.prompts")} />;
}
