import { describe, expect, it } from "vitest";

import {
  FILL_TIMEOUT_MS,
  HOSTING_FUNCTION_LIMIT_MS,
  REQUEST_OVERHEAD_MS,
  TRY_TIMEOUT,
} from "@/lib/ai/config";
import { maxDuration as fillMaxDuration } from "@/app/api/ai/fill/route";
import { maxDuration as tryMaxDuration } from "@/app/api/ai/try/route";

// ИИ обрываем сами раньше, чем хостинг оборвёт функцию: тогда человек получает понятную
// ошибку, а попытка возвращается.
describe("AI time limits fit the hosting function limit", () => {
  it("«Try it yourself»: whole stream + overhead < hosting limit", () => {
    expect(TRY_TIMEOUT.firstChunkMs).toBeLessThan(TRY_TIMEOUT.totalMs);
    expect(TRY_TIMEOUT.totalMs + REQUEST_OVERHEAD_MS).toBeLessThanOrEqual(
      HOSTING_FUNCTION_LIMIT_MS,
    );
  });

  it("«Fill with the assistant»: answer + overhead < hosting limit", () => {
    expect(FILL_TIMEOUT_MS + REQUEST_OVERHEAD_MS).toBeLessThanOrEqual(HOSTING_FUNCTION_LIMIT_MS);
  });

  it("routes do not ask for more time than the hosting gives", () => {
    expect(tryMaxDuration * 1000).toBeLessThanOrEqual(HOSTING_FUNCTION_LIMIT_MS);
    expect(fillMaxDuration * 1000).toBeLessThanOrEqual(HOSTING_FUNCTION_LIMIT_MS);
  });
});
