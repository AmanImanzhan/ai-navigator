import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Confetti } from "@/components/Confetti";
import { StatCard } from "@/components/StatCard";
import { getLesson } from "@/data/lessons";
import { theme } from "@/theme";

const HALO_SIZE = 160;
const CIRCLE_SIZE = 112;

// Когда «выпрыгивает» оранжевый круг — тогда же конфетти и вибрация.
const POP_DELAY = 100;

// Тексты и кнопки выплывают снизу по очереди: с 0.55 с, шаг 0.1 с.
function enterStep(step: number) {
  return FadeInDown.delay(550 + step * 100).duration(400);
}

// Экран победы после урока.
export default function LessonComplete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);
  const reduceMotion = useReducedMotion();

  // При «Уменьшении движения» значок сразу в конечном виде.
  const haloScale = useSharedValue(reduceMotion ? 1 : 0.3);
  const haloOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const circleScale = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (!reduceMotion) {
      // Ореол: проявляется и растёт 0.3 → 1 за 0.5 с.
      haloOpacity.set(withTiming(1, { duration: 500 }));
      haloScale.set(
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      );
      // Круг: 0 → 1.15 → пружиной обратно в 1.
      circleScale.set(
        withDelay(
          POP_DELAY,
          withSequence(
            withTiming(1.15, {
              duration: 300,
              easing: Easing.out(Easing.quad),
            }),
            withSpring(1, { damping: 12, stiffness: 200 }),
          ),
        ),
      );
    }

    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, POP_DELAY);
    return () => clearTimeout(timer);
  }, [reduceMotion, haloOpacity, haloScale, circleScale]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.get(),
    transform: [{ scale: haloScale.get() }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.get() }],
  }));

  async function handleShare() {
    const title = lesson ? `«${lesson.title}»` : "";
    try {
      await Share.share({
        message: `Урок ${title} в AI Navigator пройден! ${lesson?.skill ?? ""}`.trim(),
      });
    } catch {
      // Пользователь закрыл окно или поделиться не получилось — ничего не делаем.
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Animated.View style={[styles.halo, haloStyle]} />
          <Animated.View style={[styles.circle, circleStyle]}>
            <Animated.View entering={ZoomIn.delay(400).duration(250)}>
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={48}
                weight="bold"
                tintColor={theme.colors.onAccent}
              />
            </Animated.View>
          </Animated.View>
          <Confetti delay={POP_DELAY} duration={2500} />
        </View>

        <View style={styles.texts}>
          <Animated.Text entering={enterStep(0)} style={styles.title}>
            Урок пройден!
          </Animated.Text>
          {lesson ? (
            <Animated.Text entering={enterStep(1)} style={styles.skill}>
              {lesson.skill}
            </Animated.Text>
          ) : null}
        </View>

        <View style={styles.stats}>
          <Animated.View entering={enterStep(2)} style={styles.stat}>
            <StatCard
              tone="success"
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              value="+1"
              label="урок"
            />
          </Animated.View>
          <Animated.View entering={enterStep(3)} style={styles.stat}>
            <StatCard
              tone="accent"
              icon={{
                ios: "flame.fill",
                android: "local_fire_department",
                web: "local_fire_department",
              }}
              value="1"
              label="день подряд"
            />
          </Animated.View>
          <Animated.View entering={enterStep(4)} style={styles.stat}>
            <StatCard
              tone="warning"
              icon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
              value="1"
              label="запрос сохранён"
            />
          </Animated.View>
        </View>

        {/* Пока без перехода — экран шаблонов сделаем позже. */}
        <Animated.View entering={enterStep(5)} style={styles.templates}>
          <Text style={styles.templatesText}>Открыто 6 шаблонов</Text>
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            size={16}
            weight="semibold"
            tintColor={theme.colors.textSecondary}
          />
        </Animated.View>
      </ScrollView>

      <Animated.View entering={enterStep(6)} style={styles.actions}>
        <Button
          title="Следующий урок"
          onPress={() => router.replace("/home")}
        />
        <Button
          title="Поделиться результатом"
          variant="secondary"
          onPress={handleShare}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  badge: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    alignItems: "center",
    justifyContent: "center",
    // Конфетти рисуется поверх текста ниже.
    zIndex: 1,
  },
  halo: {
    ...StyleSheet.absoluteFill,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSubtle,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
    textAlign: "center",
  },
  skill: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    alignSelf: "stretch",
    gap: theme.spacing.xs,
  },
  stat: {
    flex: 1,
    flexDirection: "row",
  },
  templates: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  templatesText: {
    ...theme.typography.headline,
    color: theme.colors.text,
    flex: 1,
  },
  actions: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
});
