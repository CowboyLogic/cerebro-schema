# 0003: Dual Subpath Exports — Types-Only and Validator

**Level:** cerebro-schema
**Status:** Accepted
**Date:** 2026-03-28

## Context

The package serves two distinct consumer needs:

1. **Compile-time types only** — Most consumers (UI components, installers, registries) need TypeScript types for `Artifact`, `ToolId`, `Scope`, etc. They do not need to validate catalogs at runtime.
2. **Runtime validation** — Tools that load catalogs from remote sources (the CLI's registry, the VSCode extension's catalog parser) need the ajv-based `validateCatalog()` and `isCerebroCatalog()` functions.

ajv is a non-trivial dependency (~50KB minified). Pulling it into every consumer's bundle — including production builds of IDE extensions — imposes unnecessary size and startup cost on consumers that never call the validator.

## Decision

The package exposes two subpath exports via the `exports` field in `package.json`:

- **`.`** (main) — re-exports all TypeScript types from `src/types.ts` only. No ajv import, no validator code.
- **`./validate`** — exports `validateCatalog()` and `isCerebroCatalog()` from `src/validate.ts`, which imports ajv.

Consumers that only need types import from `@cowboylogic/cerebro-schema`. Consumers that need validation import from `@cowboylogic/cerebro-schema/validate`.

## Rationale

Separating the two concerns at the package API boundary means ajv is a pay-for-what-you-use dependency. A VSCode extension that bundles only types pays no ajv cost. The CLI registry, which validates catalogs at runtime, pays the ajv cost only in the `validate` subpath.

Alternatives considered:
- **Single export including both types and validator** — rejected; forces all consumers to bundle ajv even when they don't use it.
- **Two separate npm packages** — rejected; unnecessarily splits a tightly related package; subpath exports achieve the same result without the coordination overhead.

## Consequences

- `src/index.ts` must never import from `src/validate.ts` — doing so would pull ajv into the main export.
- New runtime utilities (future validators, schema upgrade helpers, etc.) belong in `./validate` or a new subpath, not in the main export.
- The `exports` map must be kept in sync with the compiled output paths in `dist/`.

## Compliance

The rule is simple: `src/index.ts` has zero ajv imports. Any change that introduces an ajv (or validator-related) import into `src/index.ts` is a violation. This is verifiable by inspecting the compiled `dist/index.js` bundle for ajv references.

---

*Supersedes: (none)*
*Related: [0001](0001-commonjs-build-output.md)*
