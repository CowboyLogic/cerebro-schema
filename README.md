# @cowboylogic/cerebro-schema

Shared schema, TypeScript types, and AJV validator for the Cerebro artifact catalog format.

Part of the [Cerebro suite](https://github.com/CowboyLogic/cerebro) — the canonical suite documentation lives in the CLI repo.

---

## What this package provides

| Export | Contents |
|--------|----------|
| `@cowboylogic/cerebro-schema` | TypeScript types (`Catalog`, `Artifact`, `ArtifactTarget`, …) |
| `@cowboylogic/cerebro-schema/validate` | AJV-based `validateCatalog()` validator (includes AJV runtime) |

The JSON Schema (`schema/cerebro-catalog.schema.json`) is the single source of truth for the catalog format. All Cerebro products — the CLI and IDE extensions — derive their types and validation from this package (see [S-0001](https://github.com/CowboyLogic/cerebro/blob/main/docs/adr/S-0001-schema-package-single-source-of-truth.md)).

---

## Installation

This package is consumed as a local `file:` dependency within the Cerebro workspace. It is not currently published to npm (see roadmap).

```bash
# From within the cerebro workspace (set up via bootstrap.js)
npm install
```

---

## Usage

```typescript
// Types only (no AJV bundle cost)
import type { Catalog, Artifact } from '@cowboylogic/cerebro-schema';

// Validation (includes AJV)
import { validateCatalog } from '@cowboylogic/cerebro-schema/validate';

const result = validateCatalog(yamlParsedObject);
if (!result.valid) {
  console.error(result.errors);
}
```

---

## Catalog format

See [`docs/catalog-format.md`](docs/catalog-format.md) for the full format reference.

---

## Contributing

See [CONTRIBUTING.md](https://github.com/CowboyLogic/cerebro/blob/main/CONTRIBUTING.md) in the CLI repo.

## License

MIT
