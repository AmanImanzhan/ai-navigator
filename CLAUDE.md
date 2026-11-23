# AI Navigator

Mobile app that teaches non-technical people to use AI tools through short practical lessons.

## About me
I'm a beginner developer learning full-stack while building this project.
Always reply in Russian. Before writing code, explain the plan in simple words.
After changes, explain what each new file/function does. Keep tasks small.

## Stack
- Monorepo with npm workspaces:
  - apps/mobile — Expo SDK 58 + React Native + TypeScript + Expo Router
  - apps/web — Next.js 16 (App Router, TypeScript): public site (en/ru/es) + API for the app, deployed on Netlify
  - packages/shared — shared types, AI protocol, subscription rules, content validation
- Backend (later): Supabase (Postgres, Auth with Apple/Google), Next.js API, Vercel AI SDK
- Payments: RevenueCat (iOS subscription, see below). Languages: English (default), Russian, Spanish

## Expo rules
Follow @apps/mobile/AGENTS.md — always check current Expo docs, don't rely on memory.

## Builds (EAS, TestFlight)
- apps/mobile/.env is local only (gitignored, not uploaded to EAS). EAS builds take every
  EXPO_PUBLIC_* from EAS environment variables (preview / production) — a new variable must be
  added there too (`npx eas-cli@latest env:set …`), see docs/release-checklist.md → TestFlight.
- Version in app.json (1.0.0); build numbers are remote (eas.json appVersionSource + autoIncrement).
  `submit.production.ios.ascAppId` in eas.json = Apple ID of the app in App Store Connect.
- Privacy Manifest: `ios.privacyManifests` in app.json. New native library → copy the reasons
  from its ios/PrivacyInfo.xcprivacy there.
- Sentry org is in the EU: SENTRY_URL=https://de.sentry.io/ must be an EAS variable next to
  SENTRY_AUTH_TOKEN (sentry-cli 3 takes the URL from the same source as the token).
- Build environment (development/preview/production) → `APP_ENV` (src/lib/appEnv.ts): Sentry
  `environment` and PostHog super property `environment`.
- iOS system dialogs language: `locales` (languages/en|ru|es.json).
- No web version: keep `web.output: "single"` in app.json. "server"/"static" (or +api files,
  server functions) make `expo export:embed` run _layout.tsx in Node during the iOS build.
  Persistent storage only via `appStorage` (src/lib/storage.ts), never AsyncStorage directly —
  it doesn't crash without `window`.

## Tests and CI
- Run from the root: `npm test`, `npm run typecheck`, `npm run lint` (all workspaces); or inside one
  workspace (`npm test` in apps/web, apps/mobile, packages/shared).
- Rule: new logic comes with a test (limits, payments, sync, privacy, validation, dates). A bug fix
  starts with a test that reproduces it. No full-screen snapshot tests. Tests never use the network
  or real keys.
- packages/shared and apps/web: Vitest, files `*.test.ts` next to the code.
- apps/web: Supabase is replaced by PGlite with our real migrations (src/test/db.ts,
  src/test/supabase.ts — rpc/from run as `authenticated`/`service_role`, so grants and RLS apply);
  Claude by `MockLanguageModelV4` from `ai/test` (src/test/ai.ts); Sentry via `vi.mock`.
  New migration → it must apply in PGlite (tests fail otherwise).
- apps/mobile: Jest + jest-expo + @testing-library/react-native (v14: `render`/`fireEvent` are
  async), files `src/**/*.test.ts(x)`, never inside src/app (routes). Tests run in the
  America/Los_Angeles time zone (jest.config.js) to catch local-day vs UTC bugs.
- CI: .github/workflows/ci.yml on every push and PR — `npm ci`, typecheck, lint, test, iOS `expo export:embed`
  (same command as EAS Bundle JavaScript), `next build`
  with placeholder env. No EAS builds and no real secrets in CI.
- npm version is pinned (`packageManager` in root package.json; CI installs it). Change
  package-lock.json only with that npm (`npx npm@<version> install …`): other npm versions write
  the lock differently and `npm ci` in CI fails ("Missing … from lock file").

## Web rules (apps/web)
- Check current Next.js docs (nextjs.org/docs), don't rely on memory. Run from apps/web:
  `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`.
- Pages in src/app/[lang] (English without prefix: /privacy; /ru/…, /es/… — see src/proxy.ts).
  Texts in src/i18n/dictionaries (en/ru/es), legal texts in src/content/legal.
- Styles: CSS Modules + tokens in src/styles/tokens.css (same values as the design system below);
  never hardcode colors or sizes in components.
- API routes in src/app/api. Check the user with getUserFromRequest (lib/supabase/server.ts);
  the secret key only via lib/supabase/admin.ts (server-only), never NEXT_PUBLIC_.
- Keep react/react-dom versions identical to apps/mobile (one React copy in the monorepo).
- Hosting: Netlify (https://ai-navigator-app.netlify.app), config in apps/web/netlify.toml
  (Base directory empty, Package directory apps/web — set in the Netlify UI). Next.js runs via the
  OpenNext adapter (automatic). Functions: 60 s hard limit, streaming up to 20 MB — AI time limits in
  src/lib/ai/config.ts must fit HOSTING_FUNCTION_LIMIT_MS (config.test.ts).
- No hosting-specific env in code: deploy env / commit / site URL come from src/lib/deploy.ts
  (next.config.ts inlines NEXT_PUBLIC_DEPLOY_* at build from Netlify CONTEXT / COMMIT_REF / URL).

## Admin panel (apps/web/src/app/admin, logic in src/lib/admin)
- Own root layout, Russian only, no [lang]; noindex (metadata + X-Robots-Tag in next.config.ts), not in sitemap.
- Sign-in: Google via Supabase OAuth (PKCE), session in cookies (@supabase/ssr, lib/supabase/session.ts);
  src/proxy.ts refreshes the session for /admin (lib/supabase/proxy.ts). Check users only with getClaims().
- Admins = table public.admins (service role only). Every page calls requireAdminPage(), every Server
  Action calls getAdminForAction() — UI checks are not security. The secret-key client comes only from
  AdminContext (lib/admin/auth.ts) — or lib/revenuecat/apply.ts after the webhook secret check;
  data loaders take AdminContext.
- Content validation lives in packages/shared/src/content (one code for app and admin):
  cleanContent → lessonContentIssues / templateTextIssues / templateFieldsIssues before every write.
  New card type or field: update shared types + validate.ts + labels.ts and lib/admin/cardSpecs.ts.
- Every write logs to admin_audit_log (lib/admin/audit.ts): who, when, which fields — no texts.

## AI assistant (apps/web/src/lib/ai, routes in src/app/api/ai)
- Vercel AI SDK + @ai-sdk/anthropic. Check current docs (ai-sdk.dev, Claude API) — APIs change often.
- Model, timeouts, max tokens — only in src/lib/ai/config.ts; daily limits (free 3 / premium 30) —
  AI_DAILY_LIMITS in packages/shared/src/subscription.ts. System prompts — in
  src/lib/ai/prompts (one file per scenario and language).
- Daily limit: Postgres functions consume_ai_request / refund_ai_request / ai_usage_status (by auth.uid(),
  no secret key). The server passes both limits; the DB picks one by public.subscriptions (has_premium).
  Consume before calling the model; refund if the model fails.
- Lesson/template context is loaded from the database, never taken from the request.
- Never log user prompts or model answers — only error types and codes.
- API protocol types (requests, NDJSON events, error codes) live in packages/shared/src/ai.ts.
- Manual check: `npm run ai:smoke` (root) prints a test user token and curl commands
  (needs Email sign-in temporarily enabled in Supabase — it's off in the project; see the script header).
- Mobile client: apps/mobile/src/lib/ai (API_URL from EXPO_PUBLIC_API_URL, NDJSON stream, AiClientError
  codes), hooks useAiTry / useAiFill / useAiUsage, UI in src/components/ai.
  Transport: React Native XMLHttpRequest (lib/ai/xhr.ts → RCTNetworking), stream read incrementally via
  onprogress, withCredentials=false, abort via AbortSignal. (In iOS production builds neither expo/fetch
  nor XHR reached *.vercel.app — the reason the API moved to Netlify.)
  Tests use src/test/fakeXhr.ts (no network).
  Error codes must be honest: `network` only for a real connection failure (XHR error, stream broken);
  anything else is `unexpected`. Unexpected failures go to Sentry via lib/ai/report.ts (operation,
  transport, code, error name/message/code and cause, HTTP status — never prompts, answers or tokens).
  Request headers are validated (buildRequestHeaders: RFC token names, printable ASCII values).
  Dev builds route every NSURLSession request through the expo-dev-client network interceptor —
  networking that works in dev can still fail in TestFlight; test network changes in a preview build.
- Sentry `tracePropagationTargets: []` (lib/monitoring): no sentry-trace/baggage on any request
  (the native iOS SDK would inject them into every NSURLSession request).

## Subscription (RevenueCat, iOS only)
- Business rules in packages/shared/src/subscription.ts: entitlement `premium`, product ids, AI limits.
  All lessons and templates are free; Premium only raises the AI limit (tracks.premium is unused).
- App: apps/mobile/src/lib/purchases (configure, logIn/logOut, purchase, restore), hooks/usePremium.ts
  (usePurchasesSetup in the root layout, usePremium for screens), key EXPO_PUBLIC_REVENUECAT_IOS_KEY.
  appUserID = Supabase user id; buying/restoring only when signed in. Needs a dev build (not Expo Go).
- Server: POST /api/revenuecat/webhook checks `Authorization: Bearer REVENUECAT_WEBHOOK_SECRET`,
  maps events in src/lib/revenuecat/events.ts (pure), writes via apply_subscription_event /
  apply_subscription_transfer (service role only; idempotent by event id, ordered by event time).
  Only the server writes public.subscriptions. RevenueCat transfer behavior: Transfer to new App User ID.
- Paywall: src/app/paywall.tsx (modal), parts in src/components/premium. Opened only by user action:
  «More requests with Premium» in LimitReachedText and Settings → AI Navigator Premium
  (components/settings/PremiumSettings.tsx: status, manage via showManageSubscriptions, restore).
  Prices, currency and trial come only from RevenueCat/StoreKit (loadPaywallOffer); the trial text
  shows only when checkTrialOrIntroductoryPriceEligibility says ELIGIBLE. Keep the Apple-required
  auto-renew text and Terms/Privacy links (lib/site.ts). After purchase waitForServerPremium polls
  /api/ai/usage until the webhook arrives.

## Errors and analytics (privacy first, EU users)
- Mobile errors: Sentry only via src/lib/monitoring (init, scrubbing, user = Supabase id only).
  Mobile analytics: PostHog only via src/lib/analytics (track/screen/identify/reset) — never import
  posthog-react-native or @sentry/react-native elsewhere. New event: add it to AnalyticsEvents first.
- Events carry only names and safe ids (lesson/track/template id, language, plan). Never send user
  texts, AI prompts/answers, notes, email, names, tokens. No session replay, no autocapture, no IDFA/ATT.
- Consent: useTelemetryStore (AsyncStorage, default on) — the Settings switch turns off both
  PostHog (optOut) and Sentry (beforeSend drops). Keys: EXPO_PUBLIC_SENTRY_DSN, EXPO_PUBLIC_POSTHOG_KEY;
  empty = off. Sentry env = EAS profile (app.config.ts extra.appEnv); source maps upload only for
  preview/production with SENTRY_AUTH_TOKEN.
- Web: Sentry only (src/instrumentation*.ts, src/lib/sentry): dataCollection turns off user, cookies,
  headers, bodies, query, genAI inputs/outputs, local variables. AI provider errors → reportAiError
  (type + status only). No PostHog/analytics on the website (no cookie banner).
- Changing what is collected → update /privacy (en/ru/es) and App Privacy in the release checklist.

## Design system
- Colors: bg #F8F5F0, card #FFFFFF, accent #D85A30, accent-pressed #BF4E28, accent-subtle #FBEAE3,
  on-accent #FFFFFF (text on accent),
  text #2A1E18, text-secondary #6E625B, border #ECE5DC, success #2F7D4A / #E7F3E9,
  warning #9A6A12 / #FDF2DD, error #C0392B / #FBEAEA, track #EFE8E0
- Brand colors (fixed by Google branding guidelines, don't change): Google button bg #FFFFFF, border #747775, text #1F1F1F
- Font: system font (SF Pro). Sizes: Display 28 bold, Title 22 semibold, Headline 17 semibold,
  Body 17, Callout 15, Label 13 medium, Caption 13
- Spacing: 4 / 8 / 12 / 16 / 20 / 24 / 32. Radius: 12 / 14 / 16 / full
- Never hardcode colors or sizes in screens — use the theme.
- App icon, splash, site icons and OG images: sources in apps/mobile/assets/brand (never edit generated
  files by hand) → `npm run brand:assets` (scripts/generate-brand-assets.mts, sharp). App is light-only
  (userInterfaceStyle light); splash and root background = bg #F8F5F0.

## Rules
- TypeScript strict, functional components, no `any`
- Only screens and layouts in apps/mobile/src/app;
  components in apps/mobile/src/components; theme in apps/mobile/src/theme
- Commit messages: Conventional Commits (feat:, fix:, chore:)

After each task, end with a short breakdown:
1) which files changed and why they belong in that folder;
2) up to 3 new concepts, explained via backend analogies (Express, Prisma, REST);
3) what to check on the phone.