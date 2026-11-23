import { NextResponse } from "next/server";

import { createSessionClient } from "@/lib/supabase/session";

// GET /admin/auth/callback — сюда Supabase возвращает после входа через Google.
// В адресе — одноразовый code; меняем его на сессию (PKCE), сессия ложится в cookies.
// Адрес должен быть в Supabase → Authentication → URL Configuration → Redirect URLs.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/admin", siteOrigin(request, origin)));
    console.error(`admin auth callback: ${error.code ?? "exchange failed"}`);
  }

  return NextResponse.redirect(
    new URL("/admin/login?error=callback", siteOrigin(request, origin)),
  );
}

// Как в документации Supabase: за балансировщиком хостинга (Netlify) настоящий адрес — в x-forwarded-host.
function siteOrigin(request: Request, origin: string): string {
  if (process.env.NODE_ENV === "development") return origin;
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (!forwardedHost) return origin;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${forwardedHost}`;
}
