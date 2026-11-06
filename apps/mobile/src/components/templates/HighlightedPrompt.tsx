import { StyleSheet, Text } from "react-native";

import { splitTemplateParts } from "@/data/templates";
import { theme } from "@/theme";

type HighlightedPromptProps = {
  text: string;
};

// Текст запроса, где поля в [квадратных скобках] подсвечены.
export function HighlightedPrompt({ text }: HighlightedPromptProps) {
  return (
    <Text style={styles.text}>
      {splitTemplateParts(text).map((part, index) =>
        part.isField ? (
          <Text key={index} style={styles.field}>
            {part.text}
          </Text>
        ) : (
          part.text
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  field: {
    color: theme.colors.accent,
    backgroundColor: theme.colors.accentSubtle,
    fontWeight: "600",
  },
});
