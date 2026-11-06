import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SavedPromptCard } from "@/components/templates/SavedPromptCard";
import { TemplateRow } from "@/components/templates/TemplateRow";
import type { PromptTemplate } from "@/data/templates";
import { useTracks } from "@/hooks/useLessons";
import { useTemplates } from "@/hooks/useTemplates";
import { useAppStore } from "@/store/useAppStore";
import { theme } from "@/theme";

type Mode = "templates" | "mine";

// Для поиска: без учёта регистра и «ё».
function normalize(text: string): string {
  return text.toLocaleLowerCase().replace(/ё/g, "е");
}

// Вкладка «Запросы»: готовые шаблоны по направлениям и свои сохранённые запросы.
export default function Prompts() {
  const { t } = useTranslation();
  // ?lesson=4 — пришли с экрана победы: показываем шаблоны только этого урока.
  const { lesson: lessonFilter } = useLocalSearchParams<{ lesson?: string }>();
  const [mode, setMode] = useState<Mode>("templates");
  const [query, setQuery] = useState("");

  const tracks = useTracks();
  const templates = useTemplates();
  const completedLessons = useAppStore((state) => state.completedLessons);
  const savedPrompts = useAppStore((state) => state.savedPrompts);
  const deletePrompt = useAppStore((state) => state.deletePrompt);

  // Фильтр по уроку важнее выбранного режима: пришли за шаблонами — показываем шаблоны.
  const activeMode: Mode = lessonFilter ? "templates" : mode;

  function handleModeChange(next: Mode) {
    if (lessonFilter) router.setParams({ lesson: undefined });
    setMode(next);
  }

  const search = normalize(query.trim());
  const matches = (template: PromptTemplate) =>
    (!lessonFilter || template.lessonId === lessonFilter) &&
    (!search ||
      normalize(template.title).includes(search) ||
      normalize(template.purpose).includes(search));

  const sections = tracks
    .map((track) => {
      const lessonIds = track.lessons.map((lesson) => lesson.id);
      return {
        track,
        title: track.title,
        data: templates.filter(
          (template) => lessonIds.includes(template.lessonId) && matches(template),
        ),
      };
    })
    .filter((section) => section.data.length > 0);

  function handleTemplatePress(template: PromptTemplate) {
    if (completedLessons.includes(template.lessonId)) {
      router.push({ pathname: "/template/[id]", params: { id: template.id } });
      return;
    }

    // Шаблон закрыт: предлагаем пройти урок. Платный урок открыть нельзя — просто объясняем.
    const track = tracks.find((item) =>
      item.lessons.some((lesson) => lesson.id === template.lessonId),
    );
    const lesson = track?.lessons.find((item) => item.id === template.lessonId);
    const params = { lesson: template.lessonId, title: lesson?.title ?? "" };

    if (track?.premium) {
      Alert.alert(t("prompts.lockedTitle"), t("prompts.premiumMessage", params), [
        { text: t("prompts.ok") },
      ]);
      return;
    }

    Alert.alert(t("prompts.lockedTitle"), t("prompts.lockedMessage", params), [
      { text: t("prompts.lockedLater"), style: "cancel" },
      {
        text: t("prompts.lockedGo"),
        onPress: () =>
          router.push({
            pathname: "/lesson/[id]",
            params: { id: template.lessonId },
          }),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("prompts.title")}</Text>
        <SegmentedControl
          segments={[
            { value: "templates", label: t("prompts.tabTemplates") },
            { value: "mine", label: t("prompts.tabMine") },
          ]}
          value={activeMode}
          onChange={handleModeChange}
        />

        {activeMode === "templates" ? (
          lessonFilter ? (
            <View style={styles.filter}>
              <Text style={styles.filterText}>
                {t("prompts.lessonFilter", { lesson: lessonFilter })}
              </Text>
              <Pressable
                onPress={() => router.setParams({ lesson: undefined })}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text style={styles.filterAction}>{t("prompts.showAll")}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.search}>
              <SymbolView
                name={{ ios: "magnifyingglass", android: "search", web: "search" }}
                size={16}
                tintColor={theme.colors.textSecondary}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("prompts.searchPlaceholder")}
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.searchInput}
                returnKeyType="search"
                clearButtonMode="while-editing"
                accessibilityLabel={t("prompts.searchPlaceholder")}
              />
              {query ? (
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel={t("prompts.clearSearch")}
                  hitSlop={8}
                >
                  <SymbolView
                    name={{
                      ios: "xmark.circle.fill",
                      android: "cancel",
                      web: "cancel",
                    }}
                    size={16}
                    tintColor={theme.colors.textSecondary}
                  />
                </Pressable>
              ) : null}
            </View>
          )
        ) : null}
      </View>

      {activeMode === "templates" ? (
        <SectionList
          sections={sections}
          keyExtractor={(template) => template.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TemplateRow
              template={item}
              locked={!completedLessons.includes(item.lessonId)}
              onPress={() => handleTemplatePress(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>{t("prompts.nothingFound")}</Text>
          }
        />
      ) : (
        <FlatList
          data={savedPrompts}
          keyExtractor={(prompt) => prompt.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SavedPromptCard prompt={item} onDelete={() => deletePrompt(item.id)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyMine}>
              <SymbolView
                name={{ ios: "text.bubble", android: "chat", web: "chat" }}
                size={40}
                tintColor={theme.colors.accent}
              />
              <Text style={styles.emptyTitle}>{t("prompts.emptyTitle")}</Text>
              <Text style={styles.emptyText}>{t("prompts.emptyText")}</Text>
              <Button
                title={t("prompts.emptyAction")}
                variant="secondary"
                onPress={() => setMode("templates")}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  searchInput: {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSubtle,
  },
  filterText: {
    ...theme.typography.headline,
    flex: 1,
    color: theme.colors.text,
  },
  filterAction: {
    ...theme.typography.callout,
    color: theme.colors.accent,
  },
  list: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  separator: {
    height: theme.spacing.xs,
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingTop: theme.spacing.xxl,
  },
  emptyMine: {
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
});
