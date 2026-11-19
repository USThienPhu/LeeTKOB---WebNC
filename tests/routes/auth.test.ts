import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { authMiddleware } from '../../src/middlewares/auth.middleware.js';

const app = express();

app.get('/healthz', authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

describe('Authentication middleware', () => {
  it('should authenticate admin-token and return user with role admin', async () => {
    const res = await request(app)
      .get('/healthz')
      .set('Authorization', 'Bearer admin-token');

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      id: 'admin-001',
      username: 'admin_root',
      role: 'admin',
      assignedClassIds: [],
    });
  });

  it('should authenticate student-token-2 for second student in class-1', async () => {
    const res = await request(app)
      .get('/healthz')
      .set('Authorization', 'Bearer student-token-2');

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      id: 'std-200',
      username: 'student_user_2',
      role: 'student',
      assignedClassIds: ['class-1'],
    });
  });
});
