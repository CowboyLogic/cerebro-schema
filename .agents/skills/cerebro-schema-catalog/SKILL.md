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
import type { CerebroCatalog, Artifact, ToolId } from '@cowboylogic/cerebro-schema';

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
  - id: code-review                # required; lowercase, a-z0-9 and hyphens, no leading/trailing hyphen
    name: Code Review              # required; display name, max 100 chars
    type: agent                    # required — see valid types below
    source: agents/code-review.md  # required; relative path, no .., no leading /
    description: "..."             # optional, max 500 chars
    supports:                      # optional; omit to allow all targets
      - claude-code
      - copilot
    tags:
      - review
```

**Valid `type` values:** `skill`, `instruction`, `prompt`, `agent`, `hook`, `mcp-server`, `snippet`, `workflow`, `other`

**Valid `supports` values (ToolId):** `agents`, `claude-code`, `copilot`, `cursor`, `windsurf`, `opencode`
4. Rebuild: `npm run build`
5. Bump the minor version in `package.json` (new types are non-breaking additions)

## CommonJS Output Requirement

This package compiles to CommonJS (`"module": "CommonJS"` in tsconfig). This is intentional — the VS Code extension host does not support ESM. Do not change the module output format without coordinating with `cerebro-vscode-ext`.

## TypeScript Constraints

- Pinned to `~5.8.3` — do not widen until TypeScript 6 migration is planned
- `moduleResolution: "node10"` — deprecated in 5.9+ but required for CJS; migration tracked in ADRs
- `skipLibCheck: true` — necessary for AJV's complex generics
