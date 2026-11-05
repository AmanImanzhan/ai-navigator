import { useTranslation } from "react-i18next";

import { ComingSoon } from "@/components/ComingSoon";

// Вкладка «Справочник». Пока заглушка.
export default function Library() {
  const { t } = useTranslation();
  return <ComingSoon title={t("tabs.library")} />;
}
