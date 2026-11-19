import { Router, type Request, type Response } from 'express';
import {
  badRequest,
  forbidden,
  notFound,
  PROBLEM_BASE_URL,
  sendProblemDetails,
} from '../errors/problem-details.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { defaultDataStore, type ReviewDecision } from '../store/data-store.js';
import type { Verdict } from '../types/review-queue.types.js';

export const reviewActionsRouter = Router();
const base = '/api/v1/classes/:classId/labs/:labId';
type LabParams = { classId: string; labId: string };

reviewActionsRouter.use(
  base,
  authMiddleware,
  (req: Request<LabParams>, res, next) => {
    const user = req.user;
    if (!user || (user.role !== 'ta' && user.role !== 'admin')) {
      forbidden(
        res,
        req.originalUrl,
        'Only TAs and administrators can review and publish labs.',
        'student-access-forbidden#FORBIDDEN_ROLE',
        'Forbidden Role'
      );
      return;
    }
    if (
      user.role === 'ta' &&
      !user.assignedClassIds.includes(req.params.classId)
    ) {
      forbidden(
        res,
        req.originalUrl,
        'TA is not assigned to this class.',
        'forbidden-lab-access#FORBIDDEN_LAB_ACCESS',
        'Unauthorized Class Access'
      );
      return;
    }
    const lab = defaultDataStore.getLab(req.params.labId);
    if (!lab || lab.classId !== req.params.classId) {
      notFound(res, req.originalUrl, 'Lab not found in this class.');
      return;
    }
    next();
  }
);

reviewActionsRouter.post(
  `${base}/review-queue/:itemId/decision`,
  (req: Request<LabParams & { itemId: string }>, res: Response) => {
    const item = defaultDataStore.getReviewItem(req.params.itemId);
    if (!item || item.labId !== req.params.labId) {
      notFound(
        res,
        req.originalUrl,
        'Review item not found in this lab.',
        'review-item-not-found',
        'Review Item Not Found'
      );
      return;
    }
    if (item.status === 'reviewed') {
      sendProblemDetails(res, {
        type: `${PROBLEM_BASE_URL}/item-already-reviewed`,
        title: 'Item Already Reviewed',
        status: 409,
        detail: 'This review item has already been reviewed.',
        instance: req.originalUrl,
      });
      return;
    }
    const { decision, newVerdict, reason } = (req.body ?? {}) as {
      decision?: unknown;
      newVerdict?: unknown;
      reason?: unknown;
    };
    const verdicts: unknown[] = ['violation', 'unsure', 'pass'];
    if (
      (decision !== 'confirm' && decision !== 'override') ||
      (decision === 'override' &&
        (!verdicts.includes(newVerdict) ||
          (reason !== undefined && typeof reason !== 'string')))
    ) {
      badRequest(
        res,
        req.originalUrl,
        'Provide decision confirm or override; override requires a valid newVerdict and a string reason if supplied.',
        undefined,
        'invalid-review-decision',
        'Invalid Review Decision'
      );
      return;
    }
    const action: ReviewDecision =
      decision === 'confirm'
        ? { decision }
        : {
            decision,
            newVerdict: newVerdict as Verdict,
            ...(typeof reason === 'string' ? { reason } : {}),
          };
    const reviewed = defaultDataStore.reviewItem(item.id, req.user!.id, action);
    res.status(200).json({
      id: reviewed.id,
      submissionId: reviewed.submissionId,
      studentAnonymousId: reviewed.studentAnonymousId,
      constraintId: reviewed.constraintId,
      constraintDescription: reviewed.constraintDescription,
      verdict: reviewed.verdict,
      suggestedDeduction: reviewed.suggestedDeduction,
      evidence: reviewed.evidence,
      unsureReason: reviewed.unsureReason,
      status: reviewed.status,
      reviewedBy: reviewed.reviewedBy,
      reviewedAt: reviewed.reviewedAt,
    });
  }
);

reviewActionsRouter.get(
  `${base}/publish-status`,
  (req: Request<LabParams>, res: Response) => {
    res.status(200).json(defaultDataStore.getPublishStatus(req.params.labId));
  }
);

reviewActionsRouter.post(
  `${base}/publish`,
  (req: Request<LabParams>, res: Response) => {
    const status = defaultDataStore.getPublishStatus(req.params.labId);
    if (!status.canPublish) {
      sendProblemDetails(res, {
        type: `${PROBLEM_BASE_URL}/unreviewed-items`,
        title: 'Unreviewed Items Remain',
        status: 400,
        detail: 'Review every pending item before publishing this lab.',
        instance: req.originalUrl,
        ...status,
      });
      return;
    }
    res.status(200).json(defaultDataStore.publishLab(req.params.labId));
  }
);
