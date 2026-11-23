// Запросы к нашему API — через XMLHttpRequest React Native (нативно — RCTNetworking).
// Поток ответа читаем по кусочкам: RN присылает onprogress с растущим responseText.
// (Ни expo/fetch, ни XHR из iOS-приложения не доходили до *.vercel.app — поэтому API переехал
// на Netlify, а транспорт остался XHR: он проверен тестами и не зависит от expo/fetch.)

export type XhrRequest = {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: string;
  signal: AbortSignal;
  // Новый кусочек ответа (только при успешном статусе 2xx). Бросил ошибку — запрос прерываем,
  // а xhrRequest завершается этой ошибкой.
  onChunk?: (text: string) => void;
};

export type XhrResponse = { status: number; text: string };

// Сбой связи: запрос не ушёл или ответ оборвался. Причины XHR не сообщает.
export class XhrNetworkError extends Error {
  constructor() {
    super("xhr network error");
    this.name = "XhrNetworkError";
  }
}

// Запрос прерван (signal): «Стоп» или наш таймаут — причину знает тот, кто прервал.
export class XhrAbortError extends Error {
  constructor() {
    super("xhr aborted");
    this.name = "AbortError";
  }
}

function isSuccess(status: number): boolean {
  return status >= 200 && status < 300;
}

export function xhrRequest(request: XhrRequest): Promise<XhrResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // Сколько символов ответа уже отдали в onChunk.
    let delivered = 0;
    let settled = false;

    const onAbortSignal = () => xhr.abort();
    const finish = (complete: () => void) => {
      if (settled) return;
      settled = true;
      request.signal.removeEventListener("abort", onAbortSignal);
      complete();
    };

    // Отдать новую часть responseText. Ошибка в обработчике — прерываем запрос.
    const deliver = (): boolean => {
      if (!request.onChunk || !isSuccess(xhr.status)) return true;
      const text = xhr.responseText;
      if (text.length <= delivered) return true;
      const chunk = text.slice(delivered);
      delivered = text.length;
      try {
        request.onChunk(chunk);
        return true;
      } catch (error) {
        finish(() => reject(error));
        xhr.abort();
        return false;
      }
    };

    xhr.onprogress = () => {
      deliver();
    };
    xhr.onload = () => {
      // Последний кусочек мог прийти вместе с завершением, без onprogress.
      if (!deliver()) return;
      finish(() => resolve({ status: xhr.status, text: xhr.responseText }));
    };
    xhr.onerror = () => finish(() => reject(new XhrNetworkError()));
    xhr.onabort = () => finish(() => reject(new XhrAbortError()));

    xhr.open(request.method, request.url);
    // Cookie нашему API не нужны: вход — по токену.
    xhr.withCredentials = false;
    for (const [name, value] of Object.entries(request.headers)) {
      xhr.setRequestHeader(name, value);
    }

    if (request.signal.aborted) {
      finish(() => reject(new XhrAbortError()));
      return;
    }
    request.signal.addEventListener("abort", onAbortSignal);
    xhr.send(request.body ?? null);
  });
}
