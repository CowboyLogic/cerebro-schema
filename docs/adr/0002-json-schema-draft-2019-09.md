# 0002: JSON Schema Draft-2019-09 (not Draft-07)

**Level:** cerebro-schema
**Status:** Accepted
**Date:** 2026-03-28

## Context

The canonical schema file (`cerebro-catalog.schema.json`) originally declared `"$schema": "http://json-schema.org/draft-07/schema#"`. However, the schema used `$defs` — a keyword that was introduced in draft-2019-09 and is not part of draft-07 (which uses `definitions` instead). This made the schema technically invalid against its own declared draft, relying on ajv's lenient handling of unrecognized keywords to avoid errors.

The mismatch also caused a runtime failure when the ajv validator was configured with `strict: true`, and produced incorrect behavior in any tool that validated the `$schema` declaration before parsing.

## Decision

The schema declares `"$schema": "https://json-schema.org/draft/2019-09/schema"`. The `$id` is set to the stable URL `https://github.com/CowboyLogic/cerebro-schema/schema/cerebro-catalog.schema.json`.

## Rationale

`$defs` is the correct keyword in draft-2019-09 and later. Using it under a draft-07 declaration is invalid and produces undefined behavior in strictly-conformant validators. Correcting the declaration aligns the schema with the keywords it actually uses.

Draft-2019-09 was chosen over draft-2020-12 because ajv v8's `Ajv2019` class provides stable, well-tested support for it, whereas draft-2020-12 support in ajv is newer and carries more edge cases.

## Consequences

- **Critical implementation note:** The validator must use `import Ajv2019 from 'ajv/dist/2019'` — NOT `import Ajv from 'ajv'`. The default ajv export supports draft-07 only and will throw `no schema with key or ref "https://json-schema.org/draft/2019-09/schema"` at compile time if used with this schema.
- Any external tools that validate `cerebro-catalog.yaml` files must also use a draft-2019-09 compatible validator.
- The `$id` URL is stable and should not change — changing it breaks any external `$ref` that points to this schema.

## Compliance

`validate.ts` must import `Ajv2019` from `'ajv/dist/2019'`. Usage of the default `Ajv` import from `'ajv'` with this schema is incorrect and will fail at runtime. This must be caught in code review.

---

*Supersedes: (none)*
*Related: (none)*
