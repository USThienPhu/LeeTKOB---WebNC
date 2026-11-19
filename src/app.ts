import express, { type Request, type Response } from 'express';
import { labsRouter } from './routes/labs.js';
import { reviewQueueRouter } from './routes/review-queue.js';
import { submissionsRouter } from './routes/submissions.js';

const app = express();

app.use(express.json());

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'leetkob-api' });
});

app.use(reviewQueueRouter);
app.use(labsRouter);
app.use(submissionsRouter);

export default app;
