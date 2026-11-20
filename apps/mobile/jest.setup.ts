import { jest } from "@jest/globals";

// Общие подмены для всех тестов приложения.

// Хранилище телефона — в памяти (официальная заглушка AsyncStorage).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// UUID — как на телефоне, но из Node.
jest.mock("expo-crypto", () => ({ randomUUID: () => crypto.randomUUID() }));
