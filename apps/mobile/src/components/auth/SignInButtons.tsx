import * as AppleAuthentication from "expo-apple-authentication";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import { BUTTON_HEIGHT } from "@/components/Button";
import { useAvailableProviders } from "@/hooks/useAuth";
import { isNetworkError, signIn, type AuthProviderId } from "@/lib/auth";
import { theme } from "@/theme";

type SignInButtonsProps = {
  onSignedIn: () => void;
};

// Кнопки входа — по одной на каждый способ, доступный на этом телефоне.
// Ошибки показывает сама: отмену — молча, остальное — понятным сообщением.
export function SignInButtons({ onSignedIn }: SignInButtonsProps) {
  const { t } = useTranslation();
  const providers = useAvailableProviders();
  const [busy, setBusy] = useState(false);

  async function handleSignIn(provider: AuthProviderId) {
    if (busy) return;
    setBusy(true);
    const result = await signIn(provider);
    setBusy(false);

    if (result.status === "signedIn") {
      onSignedIn();
    } else if (result.status === "error") {
      if (__DEV__) console.log("Вход не удался:", result.error);
      Alert.alert(
        t("auth.errorTitle"),
        isNetworkError(result.error)
          ? t("auth.errorNetwork")
          : t("auth.errorGeneric"),
      );
    }
  }

  // Ещё проверяем, какие способы доступны, — держим место, чтобы экран не прыгал.
  if (providers === null) {
    return <View style={styles.placeholder} />;
  }

  if (providers.length === 0) {
    return <Text style={styles.unavailable}>{t("auth.unavailable")}</Text>;
  }

  return (
    <View
      style={[styles.list, busy && styles.busy]}
      pointerEvents={busy ? "none" : "auto"}
    >
      {providers.map((provider) => {
        switch (provider) {
          case "apple":
            // Официальная кнопка Apple — этого требуют правила App Store.
            // Текст на ней — на языке системы iPhone.
            return (
              <AppleAuthentication.AppleAuthenticationButton
                key={provider}
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={theme.radius.md}
                style={styles.button}
                onPress={() => handleSignIn(provider)}
              />
            );
        }
      })}
      {busy ? (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={theme.colors.onAccent}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  busy: {
    opacity: 0.6,
  },
  button: {
    width: "100%",
    height: BUTTON_HEIGHT,
  },
  placeholder: {
    height: BUTTON_HEIGHT,
  },
  unavailable: {
    ...theme.typography.callout,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
