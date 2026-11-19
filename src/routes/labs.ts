import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { badRequest, forbidden } from '../errors/problem-details.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { defaultDataStore } from '../store/data-store.js';
import type { Lab } from '../types/review-queue.types.js';

export const labsRouter = Router();

labsRouter.post(
  '/api/v1/classes/:classId/labs',
  authMiddleware,
  (req: Request<{ classId: string }>, res: Response) => {
    const { classId } = req.params;
    const user = req.user;

    if (!user || (user.role !== 'ta' && user.role !== 'admin')) {
      forbidden(
        res,
        req.originalUrl,
        'Only TAs and administrators can create labs.',
        'student-access-forbidden#FORBIDDEN_ROLE',
        'Forbidden Role'
      );
      return;
    }

    if (user.role === 'ta' && !user.assignedClassIds.includes(classId)) {
      forbidden(
        res,
        req.originalUrl,
        `TA '${user.username}' is not assigned to class '${classId}'.`,
        'forbidden-lab-access#FORBIDDEN_LAB_ACCESS',
        'Unauthorized Class Access'
      );
      return;
    }

    const {
      title,
      statement = '',
      testCases,
      constraints,
    } = (req.body ?? {}) as Partial<Lab>;

    if (
      typeof title !== 'string' ||
      title.trim().length === 0 ||
      typeof statement !== 'string' ||
      !Array.isArray(testCases) ||
      !Array.isArray(constraints)
    ) {
      badRequest(
        res,
        req.originalUrl,
        'Provide a non-empty title, testCases and constraints arrays, and a string statement if supplied.',
        undefined,
        'invalid-lab-body',
        'Invalid Lab Body'
      );
      return;
    }

    const lab = defaultDataStore.createLab({
      id: randomUUID(),
      classId,
      title,
      statement,
      testCases,
      constraints,
    });

    res.status(201).json(lab);
  }
);
