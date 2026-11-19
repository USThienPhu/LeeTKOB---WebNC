import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import {
  badRequest,
  forbidden,
  notFound,
  PROBLEM_BASE_URL,
  sendProblemDetails,
} from '../errors/problem-details.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { defaultSubmissionQueue } from '../queue/submission-queue.js';
import { defaultDataStore } from '../store/data-store.js';
import type { SubmissionJob } from '../types/sandbox.types.js';

export const submissionsRouter = Router();

submissionsRouter.post(
  '/api/v1/classes/:classId/labs/:labId/submissions',
  authMiddleware,
  async (req: Request<{ classId: string; labId: string }>, res: Response) => {
    const { classId, labId } = req.params;
    const user = req.user;
    if (
      !user ||
      user.role !== 'student' ||
      !user.assignedClassIds.includes(classId)
    ) {
      forbidden(
        res,
        req.originalUrl,
        'Only students enrolled in this class can submit code.'
      );
      return;
    }

    const lab = defaultDataStore.getLab(labId);
    if (!lab || lab.classId !== classId) {
      notFound(res, req.originalUrl, 'Lab not found in this class.');
      return;
    }

    const { sourceCode } = (req.body ?? {}) as { sourceCode?: unknown };
    if (typeof sourceCode !== 'string' || sourceCode.trim().length === 0) {
      badRequest(
        res,
        req.originalUrl,
        'Provide a non-empty sourceCode string.',
        undefined,
        'invalid-submission-body',
        'Invalid Submission Body'
      );
      return;
    }

    const job: SubmissionJob = {
      submissionId: randomUUID(),
      labId,
      studentAnonymousId: user.id,
      sourceCode,
      testCases: lab.testCases,
    };
    defaultDataStore.createSubmission(job);
    try {
      await defaultSubmissionQueue.enqueue(job);
      res
        .status(202)
        .json({ submissionId: job.submissionId, status: 'queued' });
    } catch {
      sendProblemDetails(res, {
        type: `${PROBLEM_BASE_URL}/submission-queue-error`,
        title: 'Submission Queue Error',
        status: 500,
        detail: 'Unable to enqueue submission.',
        instance: req.originalUrl,
      });
    }
  }
);

submissionsRouter.get(
  '/api/v1/submissions/:submissionId',
  authMiddleware,
  async (req: Request<{ submissionId: string }>, res: Response) => {
    const { submissionId } = req.params;
    const submission = defaultDataStore.getSubmission(submissionId);
    if (!submission) {
      notFound(
        res,
        req.originalUrl,
        'Submission not found.',
        'submission-not-found',
        'Submission Not Found'
      );
      return;
    }
    if (
      req.user?.role !== 'student' ||
      req.user.id !== submission.studentAnonymousId
    ) {
      forbidden(
        res,
        req.originalUrl,
        'Only the submitting student can access this submission.'
      );
      return;
    }

    const status =
      (await defaultSubmissionQueue.getStatus(submissionId)) ??
      submission.status;
    const [queueResult] = await defaultSubmissionQueue.getResults(submissionId);
    const result = queueResult ?? submission.result;

    // Allowlist student-visible fields; never serialize internal review data.
    res.status(200).json({
      submissionId,
      status,
      ...(result
        ? {
            compileSuccess: result.compileSuccess,
            compileOutput: result.compileOutput,
            passedTests: result.passedTests,
            totalTests: result.totalTests,
          }
        : {}),
    });
  }
);
