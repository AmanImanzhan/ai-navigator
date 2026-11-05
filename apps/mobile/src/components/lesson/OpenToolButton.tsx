import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import type { ToolLink } from "@/data/lessons";

type OpenToolButtonProps = {
  tool: ToolLink;
  variant?: "primary" | "secondary";
};

// Кнопка «Открыть …»: открывает сайт инструмента в браузере внутри приложения.
export function OpenToolButton({
  tool,
  variant = "primary",
}: OpenToolButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      title={t("lesson.openTool", { name: tool.name })}
      variant={variant}
      onPress={() => WebBrowser.openBrowserAsync(tool.url)}
    />
  );
}
