import Ajv2019 from 'ajv/dist/2019';
import type { CerebroCatalog } from './types.js';
import schema from '../schema/cerebro-catalog.schema.json';

const ajv = new Ajv2019({ strict: false, allErrors: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _validate = ajv.compile(schema as any);

export interface ValidationError {
  /** JSON pointer path to the failing value (e.g. '/artifacts/0/id'). */
  path: string;
  /** Human-readable error message. */
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates an unknown value against the Cerebro catalog schema.
 *
 * Returns `{ valid: true, errors: [] }` on success, or
 * `{ valid: false, errors: [...] }` with one entry per schema violation.
 *
 * If the value is valid, it is safe to cast to `CerebroCatalog`.
 *
 * @example
 * import { validateCatalog } from '@cowboylogic/cerebro-schema/validate';
 *
 * const result = validateCatalog(parsed);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 */
export function validateCatalog(data: unknown): ValidationResult {
  const valid = _validate(data) as boolean;
  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors: ValidationError[] = (_validate.errors ?? []).map((e) => ({
    path: e.instancePath || '/',
    message: e.message ?? 'unknown error',
  }));

  return { valid: false, errors };
}

/**
 * Type guard. Returns true and narrows `data` to `CerebroCatalog` if valid.
 */
export function isCerebroCatalog(data: unknown): data is CerebroCatalog {
  return (_validate(data) as boolean);
}
