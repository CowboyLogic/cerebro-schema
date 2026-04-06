# CLAUDE.md

This file provides guidance to Claude Code when working in the `cerebro-schema` repository.

## What This Repo Is

The shared schema, TypeScript types, and AJV validator for the Cerebro artifact catalog format. All Cerebro products consume this package — do not duplicate type definitions or validation logic elsewhere.

For suite-wide context (workspace layout, inter-repo dependencies, bootstrap) see `.agents/skills/cerebro-suite-context/SKILL.md`.

## Commands

Run from the repo root:

```bash
npm run build     # compile TypeScript → dist/
npm run watch     # watch mode
npm test          # run tests if present (npm test --if-present)
```

The `prepare` script (`tsc`) runs automatically during `npm install` / `npm ci` in dependent repos.

## Package Exports

```typescript
import type { CerebroCatalog, Artifact } from '@cowboylogic/cerebro-schema'; // types only
import { validateCatalog } from '@cowboylogic/cerebro-schema/validate';      // AJV validator
```

Keep these two exports cleanly separated — consumers that only need types should not pull in AJV.

## Key Constraints

- **CommonJS output required** — `"module": "CommonJS"` in tsconfig; VS Code extension host does not support ESM
- **TypeScript pinned to `~5.8.3`** — 5.9+ has a `moduleResolution: node10` deprecation incompatibility; do not widen until the TypeScript 6 migration is planned
- **AJV v8** — uses the `ajv/dist/2019` export; do not downgrade or swap validators without checking schema draft version

## Keeping This File Current

Update this file — in the same PR as the code change — whenever package exports change, new constraints are added, or build/test commands change. Apply the same discipline to `AGENTS.md` and `.agents/skills/cerebro-schema-catalog/SKILL.md`.
