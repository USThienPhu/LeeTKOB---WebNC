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
