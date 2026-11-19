import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { defaultDataStore } from '../../src/store/data-store.js';
import type { ConstraintVerdict } from '../../src/types/constraint.types.js';
import type {
  Lab,
  ReviewQueueItem,
} from '../../src/types/review-queue.types.js';

function createLab(classId = 'class-1'): Lab {
  return defaultDataStore.createLab({
    id: randomUUID(),
    classId,
    title: 'Dynamic review lab',
    statement: 'Do not use std::sort.',
    testCases: [],
    constraints: [
      {
        id: 'C1',
        description: 'Do not use std::sort',
        deduction: 3,
        type: 'ban-list',
      },
    ],
  });
}

function pushVerdict(lab: Lab): ReviewQueueItem {
  const verdict: ConstraintVerdict = {
    constraintId: 'C1',
    verdict: 'violation',
    evidence: [{ line: 1, text: 'std::sort(a.begin(), a.end());' }],
    suggestedDeduction: 3,
    unsureReason: null,
    decidedBy: 'hard_rule',
  };
  const item: ReviewQueueItem = {
    id: randomUUID(),
    submissionId: randomUUID(),
    studentAnonymousId: 'anon-abcd1234',
    constraintId: verdict.constraintId,
    constraintDescription: lab.constraints[0].description,
    verdict: verdict.verdict,
    suggestedDeduction: verdict.suggestedDeduction,
    evidence: verdict.evidence,
    unsureReason: verdict.unsureReason,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  };
  defaultDataStore.addReviewItem({ ...item, labId: lab.id });
  return item;
}

function getQueue(lab: Lab, query = '', token = 'ta-class-1') {
  return request(app)
    .get(`/labs/${lab.id}/review-queue${query}`)
    .set('Authorization', `Bearer ${token}`);
}

describe('Review Queue Integration — Dynamic Data', () => {
  it('applies class scoping, authorization and filters to the versioned alias', async () => {
    const lab = createLab();
    const item = pushVerdict(lab);
    const path = `/api/v1/classes/class-1/labs/${lab.id}/review-queue`;
    const get = (url = path, token = 'ta-class-1') =>
      request(app).get(url).set('Authorization', `Bearer ${token}`);
    const alias = await get();
    expect(alias.status).toBe(200);
    expect(alias.body).toEqual((await getQueue(lab)).body);
    expect(alias.body.items).toEqual([item]);
    expect((await get(`${path}?verdict=pass`)).body.items).toEqual([]);
    for (const [url, token, status] of [
      [
        path.replace('/classes/class-1/', '/classes/class-2/'),
        'ta-class-1',
        404,
      ],
      [path, 'ta-class-2', 403],
      [path, 'student-token', 403],
      [`${path}?page=0`, 'ta-class-1', 400],
    ] as const) {
      const response = await get(url, token);
      expect(response.status).toBe(status);
      expect(response.headers['content-type']).toContain(
        'application/problem+json'
      );
      expect(response.body.instance).toBe(url);
    }
    expect((await request(app).get(path)).status).toBe(401);
  });

  it('should return verdicts pushed by constraint engine for a specific lab', async () => {
    const lab = createLab();
    const items = [pushVerdict(lab), pushVerdict(lab)];
    const otherLab = createLab('class-2');
    const otherItem = pushVerdict(otherLab);

    const res = await getQueue(lab);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual(items);
    expect(res.body.pagination.totalItems).toBe(2);

    const forbidden = await getQueue(otherLab);
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.type).toContain('FORBIDDEN_LAB_ACCESS');
    const assigned = await getQueue(otherLab, '', 'ta-class-2');
    expect(assigned.status).toBe(200);
    expect(assigned.body.items).toEqual([otherItem]);

    defaultDataStore.reviewItem(items[0].id, 'ta-001');
    const pending = await getQueue(lab);
    expect(pending.body.items).toEqual([items[1]]);
    const reviewed = await getQueue(lab, '?status=reviewed&verdict=violation');
    expect(reviewed.body.items).toEqual([
      {
        ...items[0],
        status: 'reviewed',
        reviewedBy: 'ta-001',
        reviewedAt: expect.any(String),
      },
    ]);
    const passes = await getQueue(lab, '?status=all&verdict=pass');
    expect(passes.body.items).toEqual([]);
    expect(passes.body.pagination.totalItems).toBe(0);
  });

  it('should return empty queue for a lab with no submissions', async () => {
    const lab = createLab();
    const res = await getQueue(lab);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [],
      pagination: {
        page: 1,
        limit: 20,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  });

  it('should correctly paginate dynamic review queue data', async () => {
    const lab = createLab();
    const items = Array.from({ length: 5 }, () => pushVerdict(lab));
    for (let page = 1; page <= 4; page++) {
      const res = await getQueue(lab, `?page=${page}&limit=2`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        items: items.slice((page - 1) * 2, page * 2),
        pagination: {
          page,
          limit: 2,
          totalItems: 5,
          totalPages: 3,
          hasNextPage: page < 3,
          hasPrevPage: page > 1,
        },
      });
    }
  });
});
