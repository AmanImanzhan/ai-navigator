# AI Navigator

Mobile app that teaches non-technical people to use AI tools through short practical lessons.

## About me
I'm a beginner developer learning full-stack while building this project.
Always reply in Russian. Before writing code, explain the plan in simple words.
After changes, explain what each new file/function does. Keep tasks small.

## Stack
- Monorepo with npm workspaces:
  - apps/mobile — Expo SDK 58 + React Native + TypeScript + Expo Router
  - apps/web — Next.js (later)
  - packages/shared — shared types and theme tokens (later)
- Backend (later): Supabase (Postgres, Auth with Apple/Google), Next.js API, Vercel AI SDK
- Payments (later): RevenueCat. Languages: English (default), Russian, Spanish

## Expo rules
Follow @apps/mobile/AGENTS.md — always check current Expo docs, don't rely on memory.

## Design system
- Colors: bg #F8F5F0, card #FFFFFF, accent #D85A30, accent-pressed #BF4E28, accent-subtle #FBEAE3,
  on-accent #FFFFFF (text on accent),
  text #2A1E18, text-secondary #6E625B, border #ECE5DC, success #2F7D4A / #E7F3E9,
  warning #9A6A12 / #FDF2DD, track #EFE8E0
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