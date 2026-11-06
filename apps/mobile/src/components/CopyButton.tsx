import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";

type CopyButtonProps = {
  text: string;
  // Подпись кнопки; по умолчанию «Скопировать».
  title?: string;
  variant?: "primary" | "secondary";
};

const COPIED_DURATION_MS = 2000;

// Кнопка «Скопировать»: копирует текст и на 2 секунды показывает «Скопировано».
export function CopyButton({
  text,
  title,
  variant = "secondary",
}: CopyButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    await Clipboard.setStringAsync(text);
    setCopied(true);
  }

  return (
    <Button
      title={copied ? t("common.copied") : (title ?? t("common.copy"))}
      variant={variant}
      onPress={handleCopy}
    />
  );
}
