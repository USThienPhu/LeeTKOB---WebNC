import 'dotenv/config';
import app from './app.js';
import { defaultJudgeWorker } from './queue/judge-worker.js';

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`LeeTKOB API server running on port ${PORT}`);
});

defaultJudgeWorker.start();
let activeJob: Promise<void> | undefined;
const workerTimer = setInterval(() => {
  if (activeJob) return;
  activeJob = defaultJudgeWorker
    .processNext()
    .then(() => {})
    .catch((error: unknown) => {
      console.error('Judge worker failed:', error);
    })
    .finally(() => {
      activeJob = undefined;
    });
}, 500);

let shuttingDown = false;
async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(workerTimer);
  defaultJudgeWorker.stop();
  await Promise.all([
    activeJob,
    new Promise<void>((resolve) => {
      server.close(() => resolve());
    }),
  ]);
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => {
    void shutdown();
  });
}
