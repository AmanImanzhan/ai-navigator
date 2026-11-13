import { Tabs } from "expo-router/js-tabs";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import type { ColorValue } from "react-native";

import { useSaveProgressPrompt } from "@/hooks/useSaveProgressPrompt";
import { theme } from "@/theme";

type TabIconProps = {
  name: SymbolViewProps["name"];
  color: ColorValue;
  size: number;
};

function TabIcon({ name, color, size }: TabIconProps) {
  return <SymbolView name={name} size={size} tintColor={color} />;
}

// Нижние вкладки. Скобки в имени папки (tabs) не попадают в адрес: этот экран — /home.
export default function TabsLayout() {
  const { t } = useTranslation();
  // После первого пройденного урока один раз предлагаем войти.
  useSaveProgressPrompt();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.lessons"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              name={{
                ios: "graduationcap.fill",
                android: "school",
                web: "school",
              }}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t("tabs.library"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              name={{
                ios: "books.vertical.fill",
                android: "library_books",
                web: "library_books",
              }}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prompts"
        options={{
          title: t("tabs.prompts"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              name={{ ios: "text.bubble.fill", android: "chat", web: "chat" }}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              name={{
                ios: "person.crop.circle.fill",
                android: "account_circle",
                web: "account_circle",
              }}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
