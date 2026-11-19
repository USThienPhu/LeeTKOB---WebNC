import type { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../errors/problem-details.js';
import type { AuthUser } from '../types/review-queue.types.js';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

const MOCK_USERS: Record<string, AuthUser> = {
  'admin-token': {
    id: 'admin-001',
    username: 'admin_root',
    role: 'admin',
    assignedClassIds: [],
  },
  'ta-class-1': {
    id: 'ta-001',
    username: 'ta_instructor_1',
    role: 'ta',
    assignedClassIds: ['class-1'],
  },
  'ta-class-2': {
    id: 'ta-002',
    username: 'ta_instructor_2',
    role: 'ta',
    assignedClassIds: ['class-2'],
  },
  'student-token': {
    id: 'std-100',
    username: 'student_user_1',
    role: 'student',
    assignedClassIds: ['class-1'],
  },
  'student-token-2': {
    id: 'std-200',
    username: 'student_user_2',
    role: 'student',
    assignedClassIds: ['class-1'],
  },
};

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
  const user = MOCK_USERS[token];

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
