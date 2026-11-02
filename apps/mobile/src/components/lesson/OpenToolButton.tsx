import * as WebBrowser from "expo-web-browser";

import { Button } from "@/components/Button";
import type { ToolCard } from "@/data/lessons";

type OpenToolButtonProps = {
  tool: ToolCard;
};

// Кнопка «Открыть …»: открывает сайт инструмента в браузере внутри приложения.
export function OpenToolButton({ tool }: OpenToolButtonProps) {
  return (
    <Button
      title={`Открыть ${tool.name}`}
      onPress={() => WebBrowser.openBrowserAsync(tool.url)}
    />
  );
}
