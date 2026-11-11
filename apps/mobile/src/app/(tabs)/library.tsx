import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ListRow } from "@/components/ListRow";
import { SegmentedControl } from "@/components/SegmentedControl";
import { TOOL_CATEGORIES } from "@/data/library";
import { useLibraryConcepts, useLibraryTools } from "@/hooks/useLibrary";
import { theme } from "@/theme";

type Mode = "tools" | "concepts";

// Для поиска: без учёта регистра и «ё».
function normalize(text: string): string {
  return text.toLocaleLowerCase().replace(/ё/g, "е");
}

// Вкладка «Справочник»: инструменты по категориям и понятия.
export default function Library() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("tools");
  const [query, setQuery] = useState("");
  const tools = useLibraryTools();
  const concepts = useLibraryConcepts();

  const search = normalize(query.trim());
  const matches = (...texts: string[]) =>
    !search || texts.some((text) => normalize(text).includes(search));

  const sections = TOOL_CATEGORIES.map((category) => {
    const data = tools.filter(
      (tool) =>
        tool.category === category &&
        matches(tool.name, tool.about, ...tool.strengths),
    );
    return { title: data[0]?.categoryTitle ?? "", data };
  }).filter((section) => section.data.length > 0);

  const filteredConcepts = concepts.filter((concept) =>
    matches(concept.title, concept.text),
  );

  const nothingFound = (
    <Text style={styles.empty}>{t("prompts.nothingFound")}</Text>
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("tabs.library")}</Text>
        <SegmentedControl
          segments={[
            { value: "tools", label: t("library.tabTools") },
            { value: "concepts", label: t("library.tabConcepts") },
          ]}
          value={mode}
          onChange={setMode}
        />
        <View style={styles.search}>
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={16}
            tintColor={theme.colors.textSecondary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("library.searchPlaceholder")}
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.searchInput}
            returnKeyType="search"
            accessibilityLabel={t("library.searchPlaceholder")}
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
      </View>

      {mode === "tools" ? (
        <SectionList
          sections={sections}
          keyExtractor={(tool) => tool.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <ListRow
              title={item.name}
              subtitle={item.about}
              onPress={() =>
                router.push({
                  pathname: "/library/tool/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={nothingFound}
        />
      ) : (
        <FlatList
          data={filteredConcepts}
          keyExtractor={(concept) => concept.id}
          contentContainerStyle={[styles.list, styles.conceptList]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => (
            <ListRow
              title={item.title}
              subtitle={item.text}
              onPress={() =>
                router.push({
                  pathname: "/library/concept/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={nothingFound}
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
  list: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  conceptList: {
    paddingTop: theme.spacing.md,
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
});
