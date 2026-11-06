import express, { type Request, type Response } from 'express';
import { reviewQueueRouter } from './routes/review-queue.js';

const app = express();

app.use(express.json());

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'leetkob-api' });
});

app.use(reviewQueueRouter);

export default app;
