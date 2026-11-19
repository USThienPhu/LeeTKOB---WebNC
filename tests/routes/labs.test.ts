import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { defaultDataStore } from '../../src/store/data-store.js';
import type { Lab } from '../../src/types/review-queue.types.js';

const labBody: Omit<Lab, 'id' | 'classId'> = {
  title: 'Sort numbers',
  statement: 'Sort the input without std::sort.',
  testCases: [{ id: 'tc-1', input: '2 1', expectedOutput: '1 2' }],
  constraints: [
    {
      id: 'C1',
      description: 'Do not use std::sort',
      deduction: 3,
      type: 'ban-list',
    },
  ],
};

describe('POST /api/v1/classes/:classId/labs', () => {
  it('should create a lab and return 201 with lab object when called by assigned TA', async () => {
    const res = await request(app)
      .post('/api/v1/classes/class-1/labs')
      .set('Authorization', 'Bearer ta-class-1')
      .send(labBody);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      classId: 'class-1',
      ...labBody,
    });
    expect(res.body.id).not.toBe('');
    expect(defaultDataStore.getLab(res.body.id)).toEqual(res.body);
  });

  it('should reject with 403 when TA is not assigned to the class', async () => {
    const res = await request(app)
      .post('/api/v1/classes/class-2/labs')
      .set('Authorization', 'Bearer ta-class-1')
      .send(labBody);

    expect(res.status).toBe(403);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body).toMatchObject({
      type: expect.any(String),
      title: expect.any(String),
      status: 403,
      detail: expect.any(String),
      instance: '/api/v1/classes/class-2/labs',
    });
  });

  it('should reject with 403 when student tries to create a lab', async () => {
    const res = await request(app)
      .post('/api/v1/classes/class-1/labs')
      .set('Authorization', 'Bearer student-token')
      .send(labBody);

    expect(res.status).toBe(403);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.status).toBe(403);
  });

  it('should reject with 401 when no auth token', async () => {
    const res = await request(app)
      .post('/api/v1/classes/class-1/labs')
      .send(labBody);

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.status).toBe(401);
  });

  it('should reject with 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/classes/class-1/labs')
      .set('Authorization', 'Bearer ta-class-1')
      .send({
        statement: labBody.statement,
        testCases: labBody.testCases,
        constraints: labBody.constraints,
      });

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.status).toBe(400);
  });
});
