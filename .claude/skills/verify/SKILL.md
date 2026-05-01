---
name: verify
description: Run lint and type checking for the sound-collect Expo app. Use after making code changes to catch issues before committing.
---

Run the following checks in order and report any failures:

1. **Lint**: `pnpm lint`
2. **Format check**: `pnpm format:check`
3. **TypeScript**: `npx tsc --noEmit`

If all pass, report success. If any fail, show the relevant error output and suggest fixes.
