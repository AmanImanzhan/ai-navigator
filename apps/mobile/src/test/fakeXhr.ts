// Поддельный XMLHttpRequest для тестов ИИ-клиента: без сети. Тест сам решает, что «пришло»:
// статус, кусочки ответа (onprogress), конец (onload), обрыв (onerror).
// Повторяет нужное поведение XHR React Native: abort() после send() вызывает onabort.

export class FakeXhr {
  static instances: FakeXhr[] = [];

  method = "";
  url = "";
  headers: Record<string, string> = {};
  body: unknown = undefined;
  withCredentials = true;
  status = 0;
  responseText = "";
  sent = false;
  done = false;

  onprogress: (() => void) | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;

  constructor() {
    FakeXhr.instances.push(this);
  }

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string): void {
    this.headers[name] = value;
  }

  send(body: unknown): void {
    this.body = body;
    this.sent = true;
  }

  abort(): void {
    if (!this.sent || this.done) return;
    this.done = true;
    this.onabort?.();
  }

  // ---- Управление из теста ----

  // Пришли заголовки ответа.
  respond(status: number): this {
    this.status = status;
    return this;
  }

  // Пришёл кусочек ответа.
  push(text: string): this {
    this.responseText += text;
    this.onprogress?.();
    return this;
  }

  // Ответ закончился (последний кусочек может прийти вместе с концом).
  finish(tail = ""): void {
    this.responseText += tail;
    this.done = true;
    this.onload?.();
  }

  // Связь оборвалась.
  fail(): void {
    this.done = true;
    this.onerror?.();
  }

  static last(): FakeXhr {
    const xhr = FakeXhr.instances.at(-1);
    if (!xhr) throw new Error("no XMLHttpRequest was created");
    return xhr;
  }

  static install(): void {
    FakeXhr.instances = [];
    globalThis.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest;
  }
}

// Запросы, которые тест уже получил через sentXhr.
const taken = new WeakSet<FakeXhr>();

// Дождаться, пока клиент создаст и отправит новый запрос (до него — await getSession и т. п.).
export async function sentXhr(): Promise<FakeXhr> {
  for (let i = 0; i < 20; i += 1) {
    const xhr = FakeXhr.instances.at(-1);
    if (xhr?.sent && !taken.has(xhr)) {
      taken.add(xhr);
      return xhr;
    }
    await Promise.resolve();
  }
  throw new Error("the request was not sent");
}
