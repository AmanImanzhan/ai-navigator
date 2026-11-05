import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { theme } from "@/theme";

type ConfettiProps = {
  // Через сколько миллисекунд начать.
  delay?: number;
  // Сколько длится полёт.
  duration?: number;
};

type Piece = {
  color: string;
  width: number;
  height: number;
  // Направление вылета (в радианах) и как далеко улетает.
  angle: number;
  distance: number;
  // Насколько опускается вниз к концу.
  fall: number;
  // На сколько градусов поворачивается за полёт.
  spin: number;
};

const COUNT = 24;
const COLORS = [
  theme.colors.accent,
  theme.colors.success,
  theme.colors.warning,
  theme.colors.accentSubtle,
];

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Конфетти создаём один раз: направления равномерно по кругу, остальное — случайно.
const PIECES: Piece[] = Array.from({ length: COUNT }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  width: random(6, 9),
  height: random(10, 16),
  angle: (i / COUNT) * Math.PI * 2 + random(-0.2, 0.2),
  distance: random(90, 170),
  fall: random(140, 260),
  spin: random(360, 720) * (i % 2 === 0 ? 1 : -1),
}));

// Конфетти разлетается из центра родителя. Нажатия проходят сквозь него.
export function Confetti({ delay = 0, duration = 2500 }: ConfettiProps) {
  const reduceMotion = useReducedMotion();
  // Общее «время» анимации: 0 — старт, 1 — конец.
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(delay, withTiming(1, { duration, easing: Easing.linear })),
    );
  }, [progress, delay, duration]);

  // Если в системе включено «Уменьшение движения» — конфетти не показываем.
  if (reduceMotion) return null;

  return (
    <View style={styles.origin} pointerEvents="none">
      {PIECES.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} progress={progress} />
      ))}
    </View>
  );
}

type ConfettiPieceProps = {
  piece: Piece;
  progress: SharedValue<number>;
};

function ConfettiPiece({ piece, progress }: ConfettiPieceProps) {
  const style = useAnimatedStyle(() => {
    const p = progress.get();
    // Быстрый вылет в начале, потом замедление.
    const burst = 1 - Math.pow(1 - p, 3);
    const x = Math.cos(piece.angle) * piece.distance * burst;
    // Взлёт по направлению + «гравитация», которая тянет вниз всё сильнее.
    const y = Math.sin(piece.angle) * piece.distance * burst + piece.fall * p * p;

    return {
      opacity: interpolate(p, [0, 0.05, 0.7, 1], [0, 1, 1, 0]),
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${piece.spin * p}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: piece.width,
          height: piece.height,
          marginLeft: -piece.width / 2,
          marginTop: -piece.height / 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // Точка в центре родителя, из которой всё вылетает.
  origin: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 0,
    height: 0,
  },
  piece: {
    position: "absolute",
    borderRadius: 2,
  },
});
