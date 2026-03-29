---
name: cerebro-schema-catalog
description: Use this skill when working in the cerebro-schema repo. Covers the catalog YAML format, how to add or modify artifact types, how to extend the JSON Schema, how the AJV validator is structured, and the dual-export package design. Trigger on questions about schema fields, catalog validation, artifact types, or package exports.
---

# cerebro-schema Package

## Purpose

Single source of truth for the Cerebro artifact catalog format. All Cerebro products derive their types and validation from this package. Do not duplicate type definitions or schema logic in other repos.

## Package Exports

```typescript
// Types only (no AJV runtime cost)
import type { Catalog, Artifact, ArtifactTarget } from '@cowboylogic/cerebro-schema';

// Validation (includes AJV)
import { validateCatalog } from '@cowboylogic/cerebro-schema/validate';
```

The dual export is deliberate — CLI and extension can import types without pulling in AJV, and only import the validator when they need it.

## Catalog YAML Format

```yaml
cerebro: "1"          # schema version string — required
name: my-repo         # optional display name
description: "..."    # optional

artifacts:
  - name: code-review              # required; lowercase, hyphens
    type: agent                    # required — see valid types below
    description: "..."             # optional, max 200 chars
    files:
      - agents/code-review.md      # required; relative paths, no ..
    targets:                       # optional; inferred from type if omitted
      - claude-code
      - opencode
    tags:
      - review
```

**Valid `type` values:** `skill`, `agent`, `prompt`, `instruction`, `hook`, `mcp-server`, `unknown`

**Valid `targets`:** `claude-code`, `opencode`, `vscode`, `copilot`

## Adding a New Artifact Type

1. Add the literal to the `ArtifactType` union in `src/types.ts`
2. Update `schema/cerebro-catalog.schema.json` — add to the `type` enum
3. Update `src/validate.ts` if any new validation rules are needed
4. Rebuild: `npm run build`
5. Bump the minor version in `package.json` (new types are non-breaking additions)

## CommonJS Output Requirement

This package compiles to CommonJS (`"module": "CommonJS"` in tsconfig). This is intentional — the VS Code extension host does not support ESM. Do not change the module output format without coordinating with `cerebro-vscode-ext`.

## TypeScript Constraints

- Pinned to `~5.8.3` — do not widen until TypeScript 6 migration is planned
- `moduleResolution: "node10"` — deprecated in 5.9+ but required for CJS; migration tracked in ADRs
- `skipLibCheck: true` — necessary for AJV's complex generics
