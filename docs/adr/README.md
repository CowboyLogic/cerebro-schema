# Architecture Decision Records — cerebro-schema

This directory contains ADRs specific to the `@cowboylogic/cerebro-schema` package.

Decisions that affect the catalog format itself or govern all Cerebro suite products live in the CLI repo as suite-level ADRs (`S-XXXX`). See [`cerebro/docs/adr/`](../../cerebro/docs/adr/) for those.

ADRs here cover implementation decisions for this package only — build output format, validator library choices, package API shape, etc.

## Process

1. Copy `_template.md`, name it `XXXX-short-title.md`
2. Set status to `Draft`; discuss and refine
3. Set status to `Accepted` once decided; record the date
4. Never edit an accepted ADR — supersede it with a new one if the decision changes

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-commonjs-build-output.md) | CommonJS build output for cross-consumer compatibility | Accepted |
| [0002](0002-json-schema-draft-2019-09.md) | JSON Schema draft-2019-09 (not draft-07) | Accepted |
| [0003](0003-dual-subpath-exports.md) | Dual subpath exports — types-only and validator | Accepted |
