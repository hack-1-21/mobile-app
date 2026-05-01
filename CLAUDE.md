# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoundReal — React Native / Expo app that collects sound data and visualizes it on a map. Uses Expo Router for navigation.

## Package Manager

Use **pnpm** (not npm or yarn).

```bash
pnpm install
```

## Development Commands

```bash
pnpm start          # Start Expo dev server
pnpm run ios        # Run on iOS simulator
pnpm run android    # Run on Android emulator
pnpm run web        # Run on web
```

## Lint & Format

```bash
pnpm lint           # Run oxlint (Rust-based linter — not ESLint)
pnpm lint:fix       # Auto-fix lint issues
pnpm format         # Format with oxfmt
pnpm format:check   # Check formatting without modifying
```

The linter is **oxlint** (not ESLint). Config is in `.oxlintrc.json`. The formatter is **oxfmt**. VS Code auto-formats on save via `oxc-vscode`.

## TypeScript

- Strict mode enabled
- Path alias: `@/*` → project root (use `@/components/Foo` not `../../components/Foo`)
- Extends `expo/tsconfig.base`

## Environment Variables

Required in `.env.local` (gitignored — must be set locally):

```
GOOGLE_MAPS_API_KEY_IOS=<key>
GOOGLE_MAPS_API_KEY_ANDROID=<key>
```

## Native Code

`/ios` and `/android` are **gitignored** and generated locally. Regenerate with:

```bash
npx expo prebuild
```

## Deployment

Uses EAS (Expo Application Services). Profiles: `development`, `preview`, `production` — see `eas.json`.

## Experimental Features

Both are enabled in `app.json`:
- **New Architecture** (React Native)
- **React Compiler** (experimental)
- **Typed Routes** (expo-router)

## Code Style

- Prefer functional components with TypeScript types
- No unused variables (oxlint enforces this — unused function args are allowed)
- Expo-specific: do not destructure `process.env` — access env vars via `Constants.expoConfig.extra` or direct `process.env.VAR`
