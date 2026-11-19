import { beforeEach, describe, expect, it } from 'vitest';
import {
  DataStore,
  defaultDataStore,
  type StoredReviewQueueItem,
} from '../../src/store/data-store.js';
import type { ConstraintVerdict } from '../../src/types/constraint.types.js';
import type { AuthUser, Lab } from '../../src/types/review-queue.types.js';
import type {
  SandboxExecutionResult,
  SubmissionJob,
} from '../../src/types/sandbox.types.js';

const lab: Lab = {
  id: 'lab-1',
  classId: 'class-1',
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

const submission: SubmissionJob = {
  submissionId: 'submission-1',
  labId: lab.id,
  studentAnonymousId: 'anon-1',
  sourceCode: 'int main() { return 0; }',
  testCases: lab.testCases,
};

const verdict: ConstraintVerdict = {
  constraintId: 'C1',
  verdict: 'violation',
  evidence: [{ line: 2, text: 'std::sort(a.begin(), a.end());' }],
  suggestedDeduction: 3,
  unsureReason: null,
  decidedBy: 'hard_rule',
};

const ta: AuthUser = {
  id: 'ta-1',
  username: 'ta_one',
  role: 'ta',
  assignedClassIds: ['class-1'],
};

function reviewItem(
  id: string,
  overrides: Partial<StoredReviewQueueItem> = {}
): StoredReviewQueueItem {
  return {
    id,
    labId: lab.id,
    submissionId: submission.submissionId,
    studentAnonymousId: submission.studentAnonymousId,
    constraintId: verdict.constraintId,
    constraintDescription: lab.constraints[0].description,
    verdict: verdict.verdict,
    suggestedDeduction: verdict.suggestedDeduction,
    evidence: verdict.evidence,
    unsureReason: verdict.unsureReason,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
    ...overrides,
  };
}

let store: DataStore;
beforeEach(() => {
  store = new DataStore();
});

describe('DataStore — Labs', () => {
  it('createLab() should store a lab and return it by id', () => {
    expect(defaultDataStore).toBeInstanceOf(DataStore);
    expect(store.createLab(lab)).toEqual(lab);
    expect(store.getLab(lab.id)).toEqual(lab);
  });

  it('createLab() should reject duplicate lab id', () => {
    store.createLab(lab);
    expect(() => store.createLab({ ...lab, title: 'Replacement' })).toThrow(
      /already exists/i
    );
    expect(store.getLab(lab.id)).toEqual(lab);
  });

  it('getLab() should return null for non-existent lab', () => {
    expect(store.getLab('missing')).toBeNull();
  });

  it('getLabsByClassId() should return only labs belonging to that class', () => {
    const second = { ...lab, id: 'lab-2' };
    store.createLab(lab);
    store.createLab(second);
    store.createLab({ ...lab, id: 'lab-3', classId: 'class-2' });
    expect(store.getLabsByClassId('class-1')).toEqual([lab, second]);
    expect(store.getLabsByClassId('missing')).toEqual([]);
  });
});

describe('DataStore — Submissions', () => {
  it('createSubmission() should store submission and return submissionId', () => {
    expect(store.createSubmission(submission)).toBe(submission.submissionId);
    expect(store.getSubmission(submission.submissionId)).toMatchObject(
      submission
    );
  });

  it('getSubmission() should return submission with status', () => {
    store.createSubmission(submission);
    expect(store.getSubmission(submission.submissionId)).toEqual({
      ...submission,
      status: 'queued',
      result: null,
    });
    expect(store.getSubmission('missing')).toBeNull();
  });

  it('updateSubmissionResult() should store sandbox execution result', () => {
    const result: SandboxExecutionResult = {
      compileSuccess: true,
      compileOutput: '',
      status: 'ACCEPTED',
      passedTests: 1,
      totalTests: 1,
      cpuTimeMs: 12,
      memoryKb: 1024,
      stdout: '1 2',
      stderr: '',
    };
    store.createSubmission(submission);
    store.updateSubmissionResult(submission.submissionId, result);
    expect(store.getSubmission(submission.submissionId)).toEqual({
      ...submission,
      status: 'completed',
      result,
    });
    expect(() => store.updateSubmissionResult('missing', result)).toThrow(
      /not found/i
    );
  });
});

describe('DataStore — Review Queue', () => {
  it('addReviewItem() should add a review queue item and retrieve it by labId', () => {
    const item = reviewItem('item-1');
    store.addReviewItem(item);
    store.addReviewItem(reviewItem('item-2', { labId: 'lab-2' }));
    expect(store.getReviewQueue(lab.id).items).toEqual([item]);
    expect(store.getReviewQueue('missing')).toEqual({
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

  it('getReviewQueue() should filter by status and verdict with pagination', () => {
    const first = reviewItem('item-1');
    const second = reviewItem('item-2');
    store.addReviewItem(reviewItem('other-lab', { labId: 'lab-2' }));
    store.addReviewItem(
      reviewItem('reviewed', {
        status: 'reviewed',
        reviewedBy: ta.id,
        reviewedAt: '2026-11-19T00:00:00.000Z',
      })
    );
    store.addReviewItem(
      reviewItem('unsure', { verdict: 'unsure', unsureReason: 'model_unsure' })
    );
    store.addReviewItem(first);
    store.addReviewItem(second);
    expect(
      store.getReviewQueue(lab.id, {
        status: 'pending',
        verdict: 'violation',
        page: 1,
        limit: 1,
      })
    ).toEqual({
      items: [first],
      pagination: {
        page: 1,
        limit: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false,
      },
    });
    expect(
      store.getReviewQueue(lab.id, {
        status: 'pending',
        verdict: 'violation',
        page: 2,
        limit: 1,
      })
    ).toEqual({
      items: [second],
      pagination: {
        page: 2,
        limit: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: false,
        hasPrevPage: true,
      },
    });
    expect(
      store.getReviewQueue(lab.id, { status: 'all', verdict: 'all' }).pagination
        .totalItems
    ).toBe(4);
    expect(store.getReviewQueue(lab.id).pagination.totalItems).toBe(3);
    expect(store.getReviewQueue(lab.id, { page: 10 }).items).toEqual([]);
  });

  it('reviewItem() should change status from pending to reviewed with TA info and timestamp', () => {
    const item = reviewItem('item-1');
    store.addReviewItem(item);
    const before = Date.now();
    const reviewed = store.reviewItem(item.id, ta.id);
    expect(reviewed).toEqual({
      ...item,
      status: 'reviewed',
      reviewedBy: ta.id,
      reviewedAt: expect.any(String),
    });
    expect(Date.parse(reviewed.reviewedAt!)).toBeGreaterThanOrEqual(before);
    expect(Date.parse(reviewed.reviewedAt!)).toBeLessThanOrEqual(Date.now());
    expect(store.getReviewQueue(lab.id).items).toEqual([]);
    expect(store.getReviewQueue(lab.id, { status: 'reviewed' }).items).toEqual([
      reviewed,
    ]);
    expect(() => store.reviewItem(item.id, 'ta-2')).toThrow(
      /already reviewed/i
    );
    expect(() => store.reviewItem('missing', ta.id)).toThrow(/not found/i);
  });

  it('getPublishStatus() should return canPublish=false when pending items exist', () => {
    store.addReviewItem(reviewItem('item-1'));
    store.addReviewItem(
      reviewItem('item-2', { verdict: 'pass', suggestedDeduction: 0 })
    );
    store.reviewItem('item-1', ta.id);
    expect(store.getPublishStatus(lab.id)).toMatchObject({
      canPublish: false,
      unreviewedCount: 1,
    });
  });

  it('getPublishStatus() should return canPublish=true when all items are reviewed', () => {
    store.addReviewItem(reviewItem('item-1'));
    store.addReviewItem(
      reviewItem('item-2', { verdict: 'unsure', unsureReason: 'timeout' })
    );
    store.addReviewItem(reviewItem('other-lab', { labId: 'lab-2' }));
    store.reviewItem('item-1', ta.id);
    store.reviewItem('item-2', ta.id);
    expect(store.getPublishStatus(lab.id)).toEqual({
      canPublish: true,
      unreviewedCount: 0,
    });
    expect(store.getPublishStatus('lab-2').canPublish).toBe(false);
  });
});
