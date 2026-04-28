import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseOpenApi } from '../lib/openapi/parse';

const fixture = (name: string) =>
  readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

describe('parseOpenApi', () => {
  it('extracts GET+POST ops, capped at 10, from a valid 3.0 spec', () => {
    const spec = JSON.parse(fixture('notion-subset.openapi.json'));
    const result = parseOpenApi(spec);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.operations.length).toBeGreaterThan(0);
    expect(result.operations.length).toBeLessThanOrEqual(10);
    for (const op of result.operations) {
      expect(['GET', 'POST']).toContain(op.method);
    }
  });

  it('parses a valid OpenAPI 3.1 spec', () => {
    const spec = JSON.parse(fixture('linear-31.openapi.json'));
    const result = parseOpenApi(spec);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.operations.map((o) => o.operationId).sort()).toEqual([
      'getIssue',
      'graphqlExecute',
      'listTeams',
    ]);
    expect(result.operations.find((o) => o.operationId === 'graphqlExecute')?.method).toBe('POST');
    expect(result.operations.find((o) => o.operationId === 'getIssue')?.method).toBe('GET');
  });

  it('rejects Swagger 2.0 with unsupported_swagger_2', () => {
    const spec = JSON.parse(fixture('petstore-swagger2.json'));
    const result = parseOpenApi(spec);
    expect(result).toEqual({ ok: false, error: 'unsupported_swagger_2' });
  });

  it('rejects unparseable input with invalid_spec', () => {
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(fixture('malformed.json'));
    } catch {
      parsed = null;
    }
    const result = parseOpenApi(parsed);
    expect(result).toEqual({ ok: false, error: 'invalid_spec' });
  });

  it('returns no_operations when paths is empty', () => {
    const result = parseOpenApi({ openapi: '3.0.0', info: {}, paths: {} });
    expect(result).toEqual({ ok: false, error: 'no_operations' });
  });
});
