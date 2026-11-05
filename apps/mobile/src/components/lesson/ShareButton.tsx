import { Share } from "react-native";

import { Button } from "@/components/Button";
import type { ShareAction } from "@/data/lessons";

type ShareButtonProps = {
  action: ShareAction;
  variant?: "primary" | "secondary";
};

// Кнопка, которая открывает системное окно «Поделиться» с готовым текстом.
export function ShareButton({ action, variant = "primary" }: ShareButtonProps) {
  async function handleShare() {
    try {
      await Share.share({ message: action.message });
    } catch {
      // Окно закрыли или поделиться не получилось — ничего не делаем.
    }
  }

  return <Button title={action.label} variant={variant} onPress={handleShare} />;
}
