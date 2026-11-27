import type { SFSymbol } from "expo-symbols";

import type { TrackId } from "@/data/lessons";

// Иконка направления (SF Symbols) — на обложке урока.
// Record требует все направления: новое направление без иконки не соберётся.
export const TRACK_ICONS: Record<TrackId, SFSymbol> = {
  texts: "text.bubble",
  images: "photo",
  video: "video",
  voice: "waveform",
  safety: "checkmark.shield",
  "work-admin": "briefcase",
  "work-management": "person.3",
};
