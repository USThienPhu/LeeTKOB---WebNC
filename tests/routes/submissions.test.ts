import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { defaultSubmissionQueue } from '../../src/queue/submission-queue.js';
import { defaultDataStore } from '../../src/store/data-store.js';
import type { SandboxExecutionResult } from '../../src/types/sandbox.types.js';

const sourceCode = '#include<iostream>\nint main(){}';
const result: SandboxExecutionResult = {
  compileSuccess: true,
  compileOutput: '',
  status: 'ACCEPTED',
  passedTests: 1,
  totalTests: 1,
  cpuTimeMs: 10,
  memoryKb: 1024,
  stdout: 'ok',
  stderr: '',
};
let labId: string;
const submissionPath = (classId = 'class-1', id = labId) =>
  `/api/v1/classes/${classId}/labs/${id}/submissions`;

beforeEach(() => {
  defaultSubmissionQueue.clear();
  labId = randomUUID();
  defaultDataStore.createLab({
    id: labId,
    classId: 'class-1',
    title: 'C++ lab',
    statement: 'Print ok',
    testCases: [{ id: 'tc-1', input: '', expectedOutput: 'ok' }],
    constraints: [],
  });
});

async function submit() {
  const res = await request(app)
    .post(submissionPath())
    .set('Authorization', 'Bearer student-token')
    .send({ sourceCode });
  expect(res.status).toBe(202);
  expect(res.body).toEqual({
    submissionId: expect.any(String),
    status: 'queued',
  });
  return res.body.submissionId as string;
}

function expectProblem(res: request.Response, status: number, path: string) {
  expect(res.status).toBe(status);
  expect(res.headers['content-type']).toContain('application/problem+json');
  expect(res.body).toMatchObject({
    type: expect.any(String),
    title: expect.any(String),
    status,
    detail: expect.any(String),
    instance: path,
  });
}

describe('POST /api/v1/classes/:classId/labs/:labId/submissions', () => {
  it('should accept C++ source code from student and return 202 with submissionId', async () => {
    const submissionId = await submit();
    expect(submissionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    const job = {
      submissionId,
      labId,
      studentAnonymousId: 'std-100',
      sourceCode,
      testCases: defaultDataStore.getLab(labId)!.testCases,
    };
    expect(defaultDataStore.getSubmission(submissionId)).toEqual({
      ...job,
      status: 'queued',
      result: null,
    });
    expect(await defaultSubmissionQueue.getJob(submissionId)).toEqual(job);
    expect(await defaultSubmissionQueue.getStatus(submissionId)).toBe('queued');
  });

  it('should reject with 403 when student is not in the class', async () => {
    const path = submissionPath('class-2');
    const res = await request(app)
      .post(path)
      .set('Authorization', 'Bearer student-token')
      .send({ sourceCode });
    expectProblem(res, 403, path);
  });

  it('should reject with 404 when lab does not exist', async () => {
    const path = submissionPath('class-1', 'missing');
    const res = await request(app)
      .post(path)
      .set('Authorization', 'Bearer student-token')
      .send({ sourceCode });
    expectProblem(res, 404, path);
  });

  it.each([{}, { sourceCode: '' }, { sourceCode: '  \n' }, { sourceCode: 42 }])(
    'should reject with 400 when sourceCode is empty or missing: %j',
    async (body) => {
      const path = submissionPath();
      const res = await request(app)
        .post(path)
        .set('Authorization', 'Bearer student-token')
        .send(body);
      expectProblem(res, 400, path);
    }
  );

  it('should reject a lab belonging to a different class', async () => {
    const otherLab = defaultDataStore.createLab({
      ...defaultDataStore.getLab(labId)!,
      id: randomUUID(),
      classId: 'class-2',
    });
    const path = submissionPath('class-1', otherLab.id);
    const res = await request(app)
      .post(path)
      .set('Authorization', 'Bearer student-token')
      .send({ sourceCode });
    expectProblem(res, 404, path);
  });

  it('should require authentication', async () => {
    const path = submissionPath();
    const res = await request(app).post(path).send({ sourceCode });
    expectProblem(res, 401, path);
  });
});

describe('GET /api/v1/submissions/:submissionId', () => {
  it('should return submission status for the submitting student', async () => {
    const submissionId = await submit();
    const get = () =>
      request(app)
        .get(`/api/v1/submissions/${submissionId}`)
        .set('Authorization', 'Bearer student-token');
    const queued = await get();
    expect(queued.status).toBe(200);
    expect(queued.body).toEqual({ submissionId, status: 'queued' });
    await defaultSubmissionQueue.dequeue();
    expect((await get()).body.status).toBe('processing');
    await defaultSubmissionQueue.storeResult(submissionId, result);
    const completed = await get();
    expect(completed.status).toBe(200);
    expect(completed.body).toMatchObject({
      submissionId,
      status: 'completed',
      compileSuccess: true,
      passedTests: 1,
      totalTests: 1,
    });
  });

  it('should NOT expose constraint verdicts to student before publish', async () => {
    const submissionId = await submit();
    defaultDataStore.addReviewItem({
      id: randomUUID(),
      labId,
      submissionId,
      studentAnonymousId: 'std-100',
      constraintId: 'C1',
      constraintDescription: 'No sorting library',
      verdict: 'violation',
      suggestedDeduction: 3,
      evidence: [],
      unsureReason: null,
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
    });
    await defaultSubmissionQueue.storeResult(submissionId, {
      ...result,
      ...{ verdict: 'violated', evidence: [], suggestedDeduction: 3 },
    });
    const res = await request(app)
      .get(`/api/v1/submissions/${submissionId}`)
      .set('Authorization', 'Bearer student-token');
    expect(res.status).toBe(200);
    expect(res.body.compileSuccess).toBe(true);
    const keys = JSON.stringify(res.body);
    for (const field of ['verdict', 'evidence', 'suggestedDeduction']) {
      expect(keys).not.toContain(`"${field}":`);
    }
  });

  it('should reject with 404 for non-existent submissionId', async () => {
    const path = '/api/v1/submissions/missing';
    const res = await request(app)
      .get(path)
      .set('Authorization', 'Bearer student-token');
    expectProblem(res, 404, path);
  });

  it('should reject access by another student in the same class', async () => {
    const submissionId = await submit();
    const path = `/api/v1/submissions/${submissionId}`;
    const res = await request(app)
      .get(path)
      .set('Authorization', 'Bearer student-token-2');
    expectProblem(res, 403, path);
  });

  it('should require authentication', async () => {
    const path = '/api/v1/submissions/missing';
    expectProblem(await request(app).get(path), 401, path);
  });
});
