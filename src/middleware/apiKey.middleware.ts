import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';
import rateLimit from 'express-rate-limit';
import { ServiceResponse } from '../@types/ServiseReponse.type';

const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// timikeys.live (Bankole2000/tm-frontend) calls these from the browser, so they can't
// carry the key: the public song-request form, its admin login, and request management.
const KEYLESS_WRITES: { methods: string[]; path: RegExp }[] = [
  { methods: ['POST'], path: /^\/api\/v1\/login\/?$/ },
  { methods: ['POST'], path: /^\/api\/v1\/requests\/?$/ },
  { methods: ['PUT', 'PATCH', 'DELETE'], path: /^\/api\/v1\/requests\/[^/]+\/?$/ },
];

// Only requests with a missing or wrong key count towards this limit, so bulk
// uploads from the admin (which send the right key) are never throttled.
const badKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const keyMatches = (key: string, expected: string) => {
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

// Writes (POST/PUT/PATCH/DELETE) need the x-api-key header to match ADMIN_API_KEY.
// If ADMIN_API_KEY isn't set, every write is refused.
export const requireApiKeyForWrites = (req: Request, res: Response, next: NextFunction) => {
  if (READ_METHODS.includes(req.method)) return next();
  if (KEYLESS_WRITES.some(w => w.methods.includes(req.method) && w.path.test(req.path))) return next();

  const expected = process.env.ADMIN_API_KEY || '';
  if (expected && keyMatches(req.get('x-api-key') || '', expected)) return next();

  return badKeyLimiter(req, res, () => {
    const sr = new ServiceResponse('Unauthorized', null, false, 401, 'Missing or invalid API key', null, 'Send the x-api-key header');
    return res.status(sr.statusCode).send(sr);
  });
};
