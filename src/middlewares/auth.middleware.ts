import type { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../errors/problem-details.js';
import type { AuthUser } from '../types/review-queue.types.js';
import { defaultDataStore } from '../store/data-store.js';
import { seedAccounts } from '../store/seed-accounts.js';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// Initialize accounts when authentication is loaded during server startup.
seedAccounts();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorized(
      res,
      req.originalUrl,
      'Authorization header is missing or empty. Provide a valid Bearer JWT.'
    );
    return;
  }

  const token = authHeader.substring(7).trim();
  const user = defaultDataStore.getAccountByToken(token);

  if (!user) {
    unauthorized(
      res,
      req.originalUrl,
      'Provided authentication token is invalid or has expired.'
    );
    return;
  }

  req.user = user;
  next();
}
