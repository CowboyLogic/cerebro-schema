# 0001: CommonJS Build Output for Cross-Consumer Compatibility

**Level:** cerebro-schema
**Status:** Accepted
**Date:** 2026-03-28

## Context

`@cowboylogic/cerebro-schema` must be consumable by two different module systems:

- The `cerebro` CLI uses ESM (`"type": "module"` in `package.json`)
- The `cerebro-vscode-ext` uses CommonJS (required by the VS Code extension host, which cannot load pure ESM packages)

The package must work for both without requiring consumers to configure module interop themselves.

## Decision

`cerebro-schema` compiles to CommonJS (`"module": "CommonJS"` in `tsconfig.json`). No ESM build is published.

## Rationale

Node.js ESM can natively `import` CommonJS packages — the interop is built into the runtime and requires no configuration. CommonJS consumers cannot `require()` a pure ESM package without dynamic `import()` workarounds, which are not compatible with how the VS Code extension host loads modules.

CommonJS is therefore the lowest common denominator that serves all current consumers without special handling.

A dual CJS + ESM build was considered but rejected as unnecessary overhead: the only concrete benefit would be tree-shaking in bundled contexts, which is not a meaningful concern for a types-and-validation package of this size.

## Consequences

- The package cannot use ESM-only syntax (top-level `await`, `import.meta`, etc.) — not a practical constraint for a types/validation package.
- If a future consumer requires pure ESM output, this ADR must be revisited and a dual-build setup introduced.
- The `exports` map in `package.json` already supports adding an `"import"` condition alongside `"default"` if a dual build is ever needed.

## Compliance

`tsconfig.json` in `cerebro-schema` must maintain `"module": "CommonJS"`. Any change to the build output format requires a new ADR superseding this one.

---

*Supersedes: (none)*
*Related: [0003](0003-dual-subpath-exports.md)*
