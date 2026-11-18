# AI Navigator

Mobile app that teaches non-technical people to use AI tools through short practical lessons.

## About me
I'm a beginner developer learning full-stack while building this project.
Always reply in Russian. Before writing code, explain the plan in simple words.
After changes, explain what each new file/function does. Keep tasks small.

## Stack
- Monorepo with npm workspaces:
  - apps/mobile — Expo SDK 58 + React Native + TypeScript + Expo Router
  - apps/web — Next.js 16 (App Router, TypeScript): public site (en/ru/es) + API for the app, deployed on Vercel
  - packages/shared — shared types and theme tokens (later)
- Backend (later): Supabase (Postgres, Auth with Apple/Google), Next.js API, Vercel AI SDK
- Payments (later): RevenueCat. Languages: English (default), Russian, Spanish

## Expo rules
Follow @apps/mobile/AGENTS.md — always check current Expo docs, don't rely on memory.

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

## Admin panel (apps/web/src/app/admin, logic in src/lib/admin)
- Own root layout, Russian only, no [lang]; noindex (metadata + X-Robots-Tag in next.config.ts), not in sitemap.
- Sign-in: Google via Supabase OAuth (PKCE), session in cookies (@supabase/ssr, lib/supabase/session.ts);
  src/proxy.ts refreshes the session for /admin (lib/supabase/proxy.ts). Check users only with getClaims().
- Admins = table public.admins (service role only). Every page calls requireAdminPage(), every Server
  Action calls getAdminForAction() — UI checks are not security. The secret-key client comes only from
  AdminContext (lib/admin/auth.ts); data loaders take AdminContext.
- Content validation lives in packages/shared/src/content (one code for app and admin):
  cleanContent → lessonContentIssues / templateTextIssues / templateFieldsIssues before every write.
  New card type or field: update shared types + validate.ts + labels.ts and lib/admin/cardSpecs.ts.
- Every write logs to admin_audit_log (lib/admin/audit.ts): who, when, which fields — no texts.

## AI assistant (apps/web/src/lib/ai, routes in src/app/api/ai)
- Vercel AI SDK + @ai-sdk/anthropic. Check current docs (ai-sdk.dev, Claude API) — APIs change often.
- Model, limits, timeouts, max tokens — only in src/lib/ai/config.ts. System prompts — in
  src/lib/ai/prompts (one file per scenario and language).
- Daily limit: Postgres functions consume_ai_request / refund_ai_request (by auth.uid(), no secret key).
  Consume before calling the model; refund if the model fails.
- Lesson/template context is loaded from the database, never taken from the request.
- Never log user prompts or model answers — only error types and codes.
- API protocol types (requests, NDJSON events, error codes) live in packages/shared/src/ai.ts.
- Manual check: `npm run ai:smoke` (root) prints a test user token and curl commands
  (needs Email sign-in temporarily enabled in Supabase — it's off in the project; see the script header).
- Mobile client: apps/mobile/src/lib/ai (API_URL from EXPO_PUBLIC_API_URL, streaming via `expo/fetch`
  + NDJSON, AiClientError codes), hooks useAiTry / useAiFill / useAiUsage, UI in src/components/ai.

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

## Rules
- TypeScript strict, functional components, no `any`
- Only screens and layouts in apps/mobile/src/app;
  components in apps/mobile/src/components; theme in apps/mobile/src/theme
- Commit messages: Conventional Commits (feat:, fix:, chore:)

After each task, end with a short breakdown:
1) which files changed and why they belong in that folder;
2) up to 3 new concepts, explained via backend analogies (Express, Prisma, REST);
3) what to check on the phone.