# AGENTS.md — Ground Rules for AI Coding Agents

This file applies to all agents working in `cerebro-schema`. Read it before making any change.

## Keeping This File Current

This file, `CLAUDE.md`, and `.agents/skills/` files are **living documents** for any coding agent — Claude Code, GitHub Copilot, or any other. Update them in the same PR as the code change whenever architecture, conventions, types, or constraints change. A stale `AGENTS.md` actively misleads future agents.

---

## Non-Negotiable Rules

1. **This package is the single source of truth.** Types, schema, and validation logic live here. Do not copy or redefine `Artifact`, `Catalog`, `ArtifactType`, or related types in other repos.

2. **CommonJS output is intentional.** `"module": "CommonJS"` in tsconfig is required for VS Code extension host compatibility. Do not change without coordinating with `cerebro-vscode-ext`.

3. **Both exports must stay clean.** The `@cowboylogic/cerebro-schema` export provides types with no runtime cost. The `/validate` export adds AJV. Do not bleed AJV into the main export.

4. **Security applies to validation.** `validateCatalog()` must reject catalogs with path-traversal attempts (`..`), absolute paths in `files`, or oversized inputs. Do not relax validation without a documented reason.

---

## Project Layout

```
src/
  index.ts       # Re-exports: Catalog, Artifact, ArtifactType, ArtifactTarget, etc.
  types.ts       # TypeScript types derived from the JSON Schema
  validate.ts    # AJV-based validateCatalog() — imports from ajv/dist/2019

schema/
  cerebro-catalog.schema.json   # JSON Schema — the authoritative format definition

docs/
  catalog-format.md             # Human-readable catalog format reference
```

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Language | TypeScript ~5.8.3 (pinned — see CLAUDE.md) |
| Module output | CommonJS (required for VS Code ext host) |
| Validator | AJV v8 (JSON Schema draft 2019-09) |
| Build | `tsc` via `prepare` script |

---

## Catalog Format Reference

The canonical format is defined in `schema/cerebro-catalog.schema.json`. Human-readable reference is in `docs/catalog-format.md`. When adding fields, update both. Bump the minor version in `package.json` for non-breaking additions.
