import { describe, expect, it } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createAppStorage } from "@/lib/storage";

describe("appStorage", () => {
  it("uses AsyncStorage on the phone", () => {
    expect(createAppStorage("ios", true)).toBe(AsyncStorage);
    expect(createAppStorage("ios", false)).toBe(AsyncStorage);
  });

  it("uses AsyncStorage in a browser", () => {
    expect(createAppStorage("web", true)).toBe(AsyncStorage);
  });

  it("web without window (Node during build): in-memory, never AsyncStorage", async () => {
    const storage = createAppStorage("web", false);
    expect(storage).not.toBe(AsyncStorage);

    expect(await storage.getItem("k")).toBeNull();
    await storage.setItem("k", "v");
    expect(await storage.getItem("k")).toBe("v");
    await storage.removeItem("k");
    expect(await storage.getItem("k")).toBeNull();
  });
});
