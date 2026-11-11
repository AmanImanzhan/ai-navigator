import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

type BulletListProps = {
  items: string[];
};

const BULLET_SIZE = 6;

// Список с точками: «Чем хорош», «Важно знать».
export function BulletList({ items }: BulletListProps) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <View style={styles.bulletBox}>
            <View style={styles.bullet} />
          </View>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  // Точка по центру первой строки текста.
  bulletBox: {
    height: theme.typography.body.lineHeight,
    justifyContent: "center",
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text,
  },
});
