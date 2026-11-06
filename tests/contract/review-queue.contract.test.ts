import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { VALID_LAB_ID } from '../../src/routes/review-queue.js';
import type { ReviewQueueItem } from '../../src/types/review-queue.types.js';

describe('CONTRACT TESTS: GET /labs/:labId/review-queue', () => {
  const BASE_URL = `/labs/${VALID_LAB_ID}/review-queue`;

  // Test 1: Happy Path & Schema Structure
  it('Test 1: should return 200 OK with compliant schema structure for assigned TA', async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set('Authorization', 'Bearer ta-class-1');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);

    const pagination = res.body.pagination;
    expect(pagination).toBeDefined();
    expect(pagination).toHaveProperty('page');
    expect(pagination).toHaveProperty('limit');
    expect(pagination).toHaveProperty('totalItems');
    expect(pagination).toHaveProperty('totalPages');
    expect(pagination).toHaveProperty('hasNextPage');
    expect(pagination).toHaveProperty('hasPrevPage');

    res.body.items.forEach((item: ReviewQueueItem) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('submissionId');
      expect(item).toHaveProperty('studentAnonymousId');
      expect(item).toHaveProperty('constraintId');
      expect(item).toHaveProperty('verdict');
      expect(item).toHaveProperty('evidence');
      expect(['violation', 'unsure', 'pass']).toContain(item.verdict);
      expect(Array.isArray(item.evidence)).toBe(true);
    });
  });

  // Test 2: Pagination Slicing Logic
  it('Test 2: should paginate and slice items properly without overlapping', async () => {
    const page1Res = await request(app)
      .get(`${BASE_URL}?page=1&limit=2`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(page1Res.status).toBe(200);
    expect(page1Res.body.items.length).toBe(2);
    expect(page1Res.body.pagination.page).toBe(1);
    expect(page1Res.body.pagination.limit).toBe(2);
    expect(page1Res.body.pagination.hasNextPage).toBe(true);

    const page2Res = await request(app)
      .get(`${BASE_URL}?page=2&limit=2`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(page2Res.status).toBe(200);
    expect(page2Res.body.items.length).toBe(2);
    expect(page2Res.body.pagination.page).toBe(2);
    expect(page2Res.body.pagination.hasPrevPage).toBe(true);

    const page1Ids = page1Res.body.items.map((i: ReviewQueueItem) => i.id);
    const page2Ids = page2Res.body.items.map((i: ReviewQueueItem) => i.id);
    expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids));
  });

  // Test 3: Query Filter (verdict & status)
  it('Test 3: should filter review queue items by verdict', async () => {
    const res = await request(app)
      .get(`${BASE_URL}?verdict=violation&status=all`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    res.body.items.forEach((item: ReviewQueueItem) => {
      expect(item.verdict).toBe('violation');
    });
  });

  // Test 4: Ownership - Cross-class Access (Quy tắc sở hữu dữ liệu)
  it('Test 4: should reject with 403 Forbidden RFC 9457 when TA belongs to another class', async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set('Authorization', 'Bearer ta-class-2');

    expect(res.status).toBe(403);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);

    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('status', 403);
    expect(res.body).toHaveProperty('detail');
    expect(res.body).toHaveProperty('instance');
    expect(res.body.type).toContain('FORBIDDEN_LAB_ACCESS');
  });

  // Test 5: Role Violation (Sinh viên không được xem review-queue)
  it('Test 5: should reject with 403 Forbidden RFC 9457 when caller has student role', async () => {
    const res = await request(app)
      .get(BASE_URL)
      .set('Authorization', 'Bearer student-token');

    expect(res.status).toBe(403);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.type).toContain('FORBIDDEN_ROLE');
    expect(res.body.status).toBe(403);
  });

  // Test 6: Authentication (Không có token)
  it('Test 6: should reject with 401 Unauthorized RFC 9457 when Authorization header is missing', async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('title');
    expect(res.body.status).toBe(401);
    expect(res.body).toHaveProperty('detail');
  });

  // Test 7: Validation Error (Query Parameters không hợp lệ)
  it('Test 7: should reject with 400 Bad Request RFC 9457 for invalid query parameters', async () => {
    const pageErrRes = await request(app)
      .get(`${BASE_URL}?page=-1`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(pageErrRes.status).toBe(400);
    expect(pageErrRes.headers['content-type']).toMatch(
      /application\/problem\+json/
    );
    expect(pageErrRes.body.status).toBe(400);
    expect(pageErrRes.body.detail).toMatch(/page/i);

    const limitErrRes = await request(app)
      .get(`${BASE_URL}?limit=500`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(limitErrRes.status).toBe(400);
    expect(limitErrRes.headers['content-type']).toMatch(
      /application\/problem\+json/
    );
    expect(limitErrRes.body.status).toBe(400);
    expect(limitErrRes.body.detail).toMatch(/limit/i);
  });

  // Test 8: Resource Not Found (Lab ID không tồn tại)
  it('Test 8: should reject with 404 Not Found RFC 9457 when labId does not exist', async () => {
    const nonexistentLabId = '00000000-0000-4000-8000-000000000000';
    const res = await request(app)
      .get(`/labs/${nonexistentLabId}/review-queue`)
      .set('Authorization', 'Bearer ta-class-1');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.status).toBe(404);
    expect(res.body).toHaveProperty('detail');
  });
});
