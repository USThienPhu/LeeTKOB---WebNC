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
  invalidParams?: { name: string; reason: string }[]
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/invalid-query-parameter`,
    title: 'Invalid Request Parameter',
    status: 400,
    detail,
    instance,
    ...(invalidParams ? { invalidParams } : {}),
  });
}

export function unauthorized(
  res: Response,
  instance: string,
  detail: string
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/missing-token`,
    title: 'Authentication Required',
    status: 401,
    detail,
    instance,
  });
}

export function forbidden(
  res: Response,
  instance: string,
  detail: string
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/forbidden-access`,
    title: 'Forbidden Access',
    status: 403,
    detail,
    instance,
  });
}

export function notFound(
  res: Response,
  instance: string,
  detail: string
): Response {
  return sendProblemDetails(res, {
    type: `${PROBLEM_BASE_URL}/resource-not-found`,
    title: 'Resource Not Found',
    status: 404,
    detail,
    instance,
  });
}
