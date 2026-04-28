import { Nango } from '@nangohq/node';

let cached: Nango | null = null;

export function getNango(): Nango {
  if (cached) return cached;
  const secretKey = process.env.NANGO_SECRET_KEY;
  if (!secretKey) {
    throw new Error('NANGO_SECRET_KEY is not set');
  }
  const host = process.env.NANGO_HOST ?? 'https://api.nango.dev';
  cached = new Nango({ secretKey, host });
  return cached;
}
