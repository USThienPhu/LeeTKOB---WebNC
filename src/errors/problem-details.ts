import type { Response } from 'express';
import type { ProblemDetails } from '../types/review-queue.types.js';

export const PROBLEM_BASE_URL = 'https://leetkob.hcmus.edu.vn/probs';

export function sendProblemDetails(
  res: Response,
  problem: ProblemDetails
): Response {
  res.setHeader('Content-Type', 'application/problem+json');
  return res.status(problem.status).json(problem);
}

export function badRequest(
  res: Response,
  instance: string,
  detail: string,
  invalidParams?: { name: string; reason: string }[],
  typeSuffix = 'invalid-query-parameter',
  title = 'Invalid Request Parameter'
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/${typeSuffix}`,
    title,
    status: 400,
    detail,
    instance,
    ...(invalidParams ? { invalidParams } : {}),
  });
}

export function unauthorized(
  res: Response,
  instance: string,
  detail: string,
  typeSuffix = 'missing-token',
  title = 'Authentication Required'
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/${typeSuffix}`,
    title,
    status: 401,
    detail,
    instance,
  });
}

export function forbidden(
  res: Response,
  instance: string,
  detail: string,
  typeSuffix = 'forbidden-access',
  title = 'Forbidden Access'
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/${typeSuffix}`,
    title,
    status: 403,
    detail,
    instance,
  });
}

export function notFound(
  res: Response,
  instance: string,
  detail: string,
  typeSuffix = 'lab-not-found',
  title = 'Lab Not Found'
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/${typeSuffix}`,
    title,
    status: 404,
    detail,
    instance,
  });
}
