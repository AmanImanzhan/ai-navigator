import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/proxy";

// Языки в адресе. Все страницы лежат в app/[lang], а в адресе английский — без префикса:
// - /ru/..., /es/... — как есть;
// - /en/... — переадресуем на адрес без /en (у страницы один адрес — так лучше для поиска);
// - всё остальное (/, /privacy) — внутри показываем /en/..., адрес в браузере не меняется.
// Админка (/admin) — без языков, на русском; здесь для неё только продлеваем сессию входа.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (firstSegment === "admin") return updateSession(request);

  if (firstSegment === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (hasLocale(firstSegment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Не трогаем API, служебные файлы Next.js и файлы с расширением (robots.txt, icon.svg…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
