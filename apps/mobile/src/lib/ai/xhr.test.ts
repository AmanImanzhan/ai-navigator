import { beforeEach, describe, expect, it } from "@jest/globals";

import { XhrAbortError, XhrNetworkError, xhrRequest } from "@/lib/ai/xhr";
import { FakeXhr, sentXhr } from "@/test/fakeXhr";

// Транспорт XHR: кусочки ответа по мере прихода, обрыв, отмена, без cookie. Без сети.

beforeEach(() => {
  FakeXhr.install();
});

function start(onChunk?: (text: string) => void, signal = new AbortController().signal) {
  return xhrRequest({
    url: "https://api.example.test/api/ai/try",
    method: "POST",
    headers: { Authorization: "Bearer t", "Content-Type": "application/json" },
    body: '{"a":1}',
    signal,
    onChunk,
  });
}

describe("xhrRequest", () => {
  it("sends method, url, headers and body, without cookies", async () => {
    const promise = start();
    const xhr = await sentXhr();

    expect(xhr.method).toBe("POST");
    expect(xhr.url).toBe("https://api.example.test/api/ai/try");
    expect(xhr.headers).toEqual({ Authorization: "Bearer t", "Content-Type": "application/json" });
    expect(xhr.body).toBe('{"a":1}');
    expect(xhr.withCredentials).toBe(false);

    xhr.respond(200).finish("ok");
    await expect(promise).resolves.toEqual({ status: 200, text: "ok" });
  });

  it("delivers only the new part of responseText, the tail arrives with load", async () => {
    const chunks: string[] = [];
    const promise = start((text) => chunks.push(text));
    const xhr = await sentXhr();

    xhr.respond(200).push("ab").push("cd");
    xhr.onprogress?.(); // повторный progress без новых данных — ничего не отдаём
    xhr.finish("ef");

    await promise;
    expect(chunks).toEqual(["ab", "cd", "ef"]);
  });

  it("error statuses are not streamed: the body comes whole at the end", async () => {
    const chunks: string[] = [];
    const promise = start((text) => chunks.push(text));
    const xhr = await sentXhr();

    xhr.respond(429).push('{"error":"limit_reached"}').finish();

    await expect(promise).resolves.toEqual({ status: 429, text: '{"error":"limit_reached"}' });
    expect(chunks).toEqual([]);
  });

  it("connection lost → XhrNetworkError", async () => {
    const promise = start(() => {});
    (await sentXhr()).respond(200).push("ab").fail();

    await expect(promise).rejects.toBeInstanceOf(XhrNetworkError);
  });

  it("signal aborted → the request is aborted, XhrAbortError", async () => {
    const controller = new AbortController();
    const promise = start(undefined, controller.signal);
    const xhr = await sentXhr();

    controller.abort();

    await expect(promise).rejects.toBeInstanceOf(XhrAbortError);
    expect(xhr.done).toBe(true);
  });

  it("signal already aborted → nothing is sent", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(start(undefined, controller.signal)).rejects.toBeInstanceOf(XhrAbortError);
    expect(FakeXhr.last().sent).toBe(false);
  });

  it("onChunk throws → request aborted, the promise rejects with that error", async () => {
    const failure = new Error("server error event");
    const promise = start(() => {
      throw failure;
    });
    const xhr = await sentXhr();

    xhr.respond(200).push("x");

    await expect(promise).rejects.toBe(failure);
    expect(xhr.done).toBe(true);
  });
});
