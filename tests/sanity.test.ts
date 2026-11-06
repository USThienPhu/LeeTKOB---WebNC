import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app.js';

describe('GET /healthz', () => {
  it('should return 200 and healthy service payload', async () => {
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      service: 'leetkob-api',
    });
  });
});
