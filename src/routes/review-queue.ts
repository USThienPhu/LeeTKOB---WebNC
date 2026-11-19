import { Router, type Request, type Response } from 'express';
import { badRequest, forbidden, notFound } from '../errors/problem-details.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { defaultDataStore } from '../store/data-store.js';
import type {
  ReviewItemStatus,
  ReviewQueueItem,
  ReviewQueueResponse,
  Verdict,
} from '../types/review-queue.types.js';

export const VALID_LAB_ID = '11111111-1111-4111-8111-111111111111';
export const VALID_LAB_CLASS_ID = 'class-1';

const MOCK_REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: 'e4f8d9b2-3c1a-4d5e-8f2a-1b3c5d7e9f01',
    submissionId: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    studentAnonymousId: 'anon-k8f9a2b1',
    constraintId: 'C1',
    constraintDescription:
      'Bắt buộc sử dụng Merge Sort; cấm gọi trực tiếp std::sort',
    verdict: 'violation',
    suggestedDeduction: 3.0,
    evidence: [{ line: 42, text: 'std::sort(arr.begin(), arr.end());' }],
    unsureReason: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'e4f8d9b2-3c1a-4d5e-8f2a-1b3c5d7e9f02',
    submissionId: 'b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e',
    studentAnonymousId: 'anon-j4h2k8l9',
    constraintId: 'C2',
    constraintDescription:
      'Cấm sử dụng vòng lặp while/for trong hàm phân chia đệ quy',
    verdict: 'violation',
    suggestedDeduction: 2.0,
    evidence: [{ line: 18, text: 'for (int i = 0; i < n; i++) {' }],
    unsureReason: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'f5a9e0c3-4d2b-5e6f-9a3b-2c4d6e8f0a12',
    submissionId: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    studentAnonymousId: 'anon-m3x7p9q2',
    constraintId: 'C3',
    constraintDescription:
      'Hàm sắp xếp bắt buộc phải sử dụng đệ quy để chia mảng',
    verdict: 'unsure',
    suggestedDeduction: 2.0,
    evidence: [],
    unsureReason: 'line_mismatch',
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'f5a9e0c3-4d2b-5e6f-9a3b-2c4d6e8f0a13',
    submissionId: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    studentAnonymousId: 'anon-p9r4t2w8',
    constraintId: 'C4',
    constraintDescription: 'Ràng buộc bộ nhớ phụ O(N) trong bước hợp nhất mảng',
    verdict: 'unsure',
    suggestedDeduction: 1.5,
    evidence: [],
    unsureReason: 'model_unsure',
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  },
  {
    id: 'a7b8c9d0-e1f2-4a3b-8c5d-6e7f8a9b0c1d',
    submissionId: 'e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b',
    studentAnonymousId: 'anon-v7z1x3c5',
    constraintId: 'C1',
    constraintDescription:
      'Bắt buộc sử dụng Merge Sort; cấm gọi trực tiếp std::sort',
    verdict: 'pass',
    suggestedDeduction: 0.0,
    evidence: [],
    unsureReason: null,
    status: 'pending',
    reviewedBy: null,
    reviewedAt: null,
  },
];

// Preserve the PA#02 fixture while serving every lab from the shared store.
defaultDataStore.createLab({
  id: VALID_LAB_ID,
  classId: VALID_LAB_CLASS_ID,
  title: 'PA#02 review queue',
  statement: '',
  testCases: [],
  constraints: [],
});
for (const item of MOCK_REVIEW_QUEUE) {
  defaultDataStore.addReviewItem({ ...item, labId: VALID_LAB_ID });
}

const VALID_STATUSES: (ReviewItemStatus | 'all')[] = [
  'pending',
  'reviewed',
  'all',
];
const VALID_VERDICTS: (Verdict | 'all')[] = [
  'violation',
  'unsure',
  'pass',
  'all',
];

export const reviewQueueRouter = Router();

reviewQueueRouter.get(
  '/labs/:labId/review-queue',
  authMiddleware,
  (req: Request<{ labId: string }>, res: Response) => {
    const { labId } = req.params;
    const user = req.user;

    // 1. Kiểm tra tồn tại bài lab
    const lab = defaultDataStore.getLab(labId);
    if (!lab) {
      notFound(
        res,
        req.originalUrl,
        `Bài thực hành với mã '${labId}' không tồn tại trong cơ sở dữ liệu.`,
        'lab-not-found',
        'Lab Not Found'
      );
      return;
    }

    // 2. Kiểm tra vai trò & quy tắc sở hữu (Roles & Ownership Rule)
    if (!user || user.role === 'student') {
      forbidden(
        res,
        req.originalUrl,
        'Sinh viên không có quyền truy cập hàng đợi rà soát của Trợ giảng.',
        'student-access-forbidden#FORBIDDEN_ROLE',
        'Forbidden Role'
      );
      return;
    }

    if (!user.assignedClassIds.includes(lab.classId)) {
      forbidden(
        res,
        req.originalUrl,
        `Trợ giảng '${user.username}' không được phân công phụ trách lớp '${lab.classId}' sở hữu bài lab này.`,
        'forbidden-lab-access#FORBIDDEN_LAB_ACCESS',
        'Unauthorized Class Access'
      );
      return;
    }

    // 3. Kiểm tra tham số phân trang & lọc (Query Parameters Validation)
    const rawPage = req.query.page !== undefined ? Number(req.query.page) : 1;
    if (!Number.isInteger(rawPage) || rawPage < 1) {
      badRequest(
        res,
        req.originalUrl,
        `Query parameter 'page' phải là số nguyên lớn hơn hoặc bằng 1. Giá trị nhận được: ${req.query.page}.`
      );
      return;
    }

    const rawLimit =
      req.query.limit !== undefined ? Number(req.query.limit) : 20;
    if (!Number.isInteger(rawLimit) || rawLimit < 1 || rawLimit > 100) {
      badRequest(
        res,
        req.originalUrl,
        `Query parameter 'limit' phải là số nguyên trong khoảng [1, 100]. Giá trị nhận được: ${req.query.limit}.`
      );
      return;
    }

    const rawStatus = (req.query.status as string) || 'pending';
    if (!VALID_STATUSES.includes(rawStatus as ReviewItemStatus | 'all')) {
      badRequest(
        res,
        req.originalUrl,
        `Query parameter 'status' không hợp lệ. Các giá trị được chấp nhận: ${VALID_STATUSES.join(', ')}.`
      );
      return;
    }

    const rawVerdict = (req.query.verdict as string) || 'all';
    if (!VALID_VERDICTS.includes(rawVerdict as Verdict | 'all')) {
      badRequest(
        res,
        req.originalUrl,
        `Query parameter 'verdict' không hợp lệ. Các giá trị được chấp nhận: ${VALID_VERDICTS.join(', ')}.`
      );
      return;
    }

    // 4. Lọc và phân trang dữ liệu từ DataStore.
    const queue = defaultDataStore.getReviewQueue(labId, {
      status: rawStatus as ReviewItemStatus | 'all',
      verdict: rawVerdict as Verdict | 'all',
      page: rawPage,
      limit: rawLimit,
    });

    // Keep storage-only fields out of the PA#02 response schema.
    const responsePayload: ReviewQueueResponse = {
      items: queue.items.map((item) => ({
        id: item.id,
        submissionId: item.submissionId,
        studentAnonymousId: item.studentAnonymousId,
        constraintId: item.constraintId,
        constraintDescription: item.constraintDescription,
        verdict: item.verdict,
        suggestedDeduction: item.suggestedDeduction,
        evidence: item.evidence,
        unsureReason: item.unsureReason,
        status: item.status,
        reviewedBy: item.reviewedBy,
        reviewedAt: item.reviewedAt,
      })),
      pagination: queue.pagination,
    };

    res.status(200).json(responsePayload);
  }
);
