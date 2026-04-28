export type Operation = {
  operationId: string;
  method: 'GET' | 'POST';
  path: string;
  summary?: string;
  description?: string;
};

export type ParseError =
  | 'unsupported_swagger_2'
  | 'invalid_spec'
  | 'no_operations';

export type ParseResult =
  | { ok: true; operations: Operation[] }
  | { ok: false; error: ParseError };

const MAX_OPS = 10;

export function parseOpenApi(spec: unknown): ParseResult {
  if (!spec || typeof spec !== 'object') {
    return { ok: false, error: 'invalid_spec' };
  }
  const s = spec as Record<string, unknown>;

  if (typeof s.swagger === 'string') {
    return { ok: false, error: 'unsupported_swagger_2' };
  }
  if (typeof s.openapi !== 'string' || !s.openapi.startsWith('3.')) {
    return { ok: false, error: 'invalid_spec' };
  }

  const paths = s.paths;
  if (!paths || typeof paths !== 'object') {
    return { ok: false, error: 'no_operations' };
  }

  const operations: Operation[] = [];
  for (const [path, methods] of Object.entries(paths as Record<string, unknown>)) {
    if (!methods || typeof methods !== 'object') continue;
    const methodsRecord = methods as Record<string, unknown>;
    for (const method of ['get', 'post'] as const) {
      const raw = methodsRecord[method];
      if (!raw || typeof raw !== 'object') continue;
      const op = raw as { operationId?: string; summary?: string; description?: string };
      operations.push({
        operationId: op.operationId ?? `${method}_${path}`,
        method: method.toUpperCase() as 'GET' | 'POST',
        path,
        summary: op.summary,
        description: op.description,
      });
      if (operations.length === MAX_OPS) {
        return { ok: true, operations };
      }
    }
  }

  if (operations.length === 0) {
    return { ok: false, error: 'no_operations' };
  }
  return { ok: true, operations };
}
