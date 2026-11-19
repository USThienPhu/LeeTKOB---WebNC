import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { defaultDataStore } from '../../src/store/data-store.js';
import type {
  Lab,
  ReviewQueueItem,
} from '../../src/types/review-queue.types.js';

let lab: Lab;
let items: ReviewQueueItem[];
let base: string;

beforeEach(() => {
  lab = defaultDataStore.createLab({
    id: randomUUID(),
    classId: 'class-1',
    title: 'Human gate',
    statement: '',
    testCases: [],
    constraints: [],
  });
  items = ['violation', 'unsure', 'pass'].map((verdict) => ({
    id: randomUUID(),
    submissionId: randomUUID(),
    studentAnonymousId: 'anon-abcd1234',
    constraintId: 'C1',
    constraintDescription: 'No std::sort',
    verdict: verdict as ReviewQueueItem['verdict'],
    suggestedDeduction: 3,
    evidence: [],
    unsureReason: verdict === 'unsure' ? 'model_unsure' : null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  }));
  for (const item of items)
    defaultDataStore.addReviewItem({ ...item, labId: lab.id });
  base = `/api/v1/classes/class-1/labs/${lab.id}`;
});

function decide(
  itemId = items[0].id,
  body: object = { decision: 'confirm' },
  token = 'ta-class-1',
  path = base
) {
  return request(app)
    .post(`${path}/review-queue/${itemId}/decision`)
    .set('Authorization', `Bearer ${token}`)
    .send(body);
}

async function reviewAll() {
  for (const item of items) expect((await decide(item.id)).status).toBe(200);
}

function expectProblem(res: request.Response, status: number) {
  expect(res.status).toBe(status);
  expect(res.headers['content-type']).toContain('application/problem+json');
  expect(res.body).toMatchObject({
    type: expect.any(String),
    title: expect.any(String),
    status,
    detail: expect.any(String),
    instance: expect.any(String),
  });
}

describe('POST /api/v1/classes/:classId/labs/:labId/review-queue/:itemId/decision', () => {
  it('should allow TA to approve a pending item → status becomes reviewed', async () => {
    const res = await decide();
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      ...items[0],
      status: 'reviewed',
      reviewedBy: 'ta-001',
      reviewedAt: expect.any(String),
    });
    expect(new Date(res.body.reviewedAt).toISOString()).toBe(
      res.body.reviewedAt
    );
    expect(
      defaultDataStore.getReviewQueue(lab.id, { status: 'reviewed' }).items[0]
    ).toMatchObject(res.body);
  });

  it('should allow TA to override verdict', async () => {
    const res = await decide(items[1].id, {
      decision: 'override',
      newVerdict: 'pass',
      reason: 'False positive',
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      verdict: 'pass',
      unsureReason: null,
      status: 'reviewed',
      reviewedBy: 'ta-001',
    });
    expect(
      defaultDataStore.getReviewQueue(lab.id, { status: 'reviewed' }).items[0]
        .verdict
    ).toBe('pass');
  });

  it('should reject with 403 when TA from different class tries to review', async () => {
    expectProblem(
      await decide(items[0].id, { decision: 'confirm' }, 'ta-class-2'),
      403
    );
    expect(defaultDataStore.getPublishStatus(lab.id).unreviewedCount).toBe(3);
  });

  it('should reject with 404 when itemId does not exist', async () => {
    expectProblem(await decide(randomUUID()), 404);
  });

  it('should reject with 409 when item is already reviewed', async () => {
    const first = await decide();
    expect(first.status).toBe(200);
    expectProblem(
      await decide(items[0].id, { decision: 'override', newVerdict: 'pass' }),
      409
    );
    expect(
      defaultDataStore.getReviewQueue(lab.id, { status: 'reviewed' }).items[0]
    ).toMatchObject(first.body);
  });

  it.each([
    {},
    { decision: 'invalid' },
    { decision: 'override' },
    { decision: 'override', newVerdict: 'invalid' },
  ])(
    'should reject invalid decision body %j without mutation',
    async (body) => {
      expectProblem(await decide(items[0].id, body), 400);
      expect(defaultDataStore.getPublishStatus(lab.id).unreviewedCount).toBe(3);
    }
  );

  it('should reject an item belonging to another lab', async () => {
    const other = defaultDataStore.createLab({ ...lab, id: randomUUID() });
    expectProblem(
      await decide(
        items[0].id,
        { decision: 'confirm' },
        'ta-class-1',
        base.replace(lab.id, other.id)
      ),
      404
    );
    expect(defaultDataStore.getPublishStatus(lab.id).unreviewedCount).toBe(3);
  });
});

describe('GET /api/v1/classes/:classId/labs/:labId/publish-status', () => {
  it('should return canPublish=false and unreviewedCount when pending items exist', async () => {
    await decide();
    const res = await request(app)
      .get(`${base}/publish-status`)
      .set('Authorization', 'Bearer ta-class-1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ canPublish: false, unreviewedCount: 2 });
  });

  it('should return canPublish=true and unreviewedCount=0 after all items reviewed', async () => {
    await reviewAll();
    const res = await request(app)
      .get(`${base}/publish-status`)
      .set('Authorization', 'Bearer ta-class-1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ canPublish: true, unreviewedCount: 0 });
    expect(defaultDataStore.getLab(lab.id)).not.toHaveProperty(
      'status',
      'published'
    );
  });
});

describe('POST /api/v1/classes/:classId/labs/:labId/publish', () => {
  it('should reject with 400 when unreviewed items remain', async () => {
    const res = await request(app)
      .post(`${base}/publish`)
      .set('Authorization', 'Bearer ta-class-1');
    expectProblem(res, 400);
    expect(res.body.unreviewedCount).toBe(3);
    expect(defaultDataStore.getLab(lab.id)).not.toHaveProperty(
      'status',
      'published'
    );
  });

  it('should succeed with 200 when all items are reviewed', async () => {
    await reviewAll();
    const res = await request(app)
      .post(`${base}/publish`)
      .set('Authorization', 'Bearer ta-class-1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: lab.id, status: 'published' });
    expect(defaultDataStore.getLab(lab.id)).toMatchObject({
      status: 'published',
    });
  });

  it('should reject with 403 when student tries to publish', async () => {
    await reviewAll();
    expectProblem(
      await request(app)
        .post(`${base}/publish`)
        .set('Authorization', 'Bearer student-token'),
      403
    );
  });

  it('should reject with 403 when TA from other class tries to publish', async () => {
    await reviewAll();
    expectProblem(
      await request(app)
        .post(`${base}/publish`)
        .set('Authorization', 'Bearer ta-class-2'),
      403
    );
  });
});

describe('Review action access guards', () => {
  it.each(['decision', 'publish-status', 'publish'])(
    'should enforce authentication, role and lab ownership for %s',
    async (action) => {
      const call = (path: string, token?: string) => {
        const suffix =
          action === 'decision'
            ? `review-queue/${items[0].id}/decision`
            : action;
        const req =
          action === 'publish-status'
            ? request(app).get(`${path}/${suffix}`)
            : request(app)
                .post(`${path}/${suffix}`)
                .send({ decision: 'confirm' });
        return token ? req.set('Authorization', `Bearer ${token}`) : req;
      };
      expectProblem(await call(base), 401);
      expectProblem(await call(base, 'student-token'), 403);
      expectProblem(await call(base, 'ta-class-2'), 403);
      expectProblem(
        await call(base.replace(lab.id, randomUUID()), 'ta-class-1'),
        404
      );
      expectProblem(
        await call(base.replace('class-1', 'class-2'), 'admin-token'),
        404
      );
    }
  );

  it('should allow admin to review and explicitly publish', async () => {
    for (const item of items)
      expect(
        (await decide(item.id, { decision: 'confirm' }, 'admin-token')).status
      ).toBe(200);
    expect(
      (
        await request(app)
          .get(`${base}/publish-status`)
          .set('Authorization', 'Bearer admin-token')
      ).body.canPublish
    ).toBe(true);
    expect(
      (
        await request(app)
          .post(`${base}/publish`)
          .set('Authorization', 'Bearer admin-token')
      ).status
    ).toBe(200);
  });
});
