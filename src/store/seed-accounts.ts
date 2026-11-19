import { DataStore, defaultDataStore } from './data-store.js';
import type { AuthUser } from '../types/review-queue.types.js';

// Demo Bearer tokens preserve the existing authentication contract.
const TEST_ACCOUNTS: ReadonlyArray<{ token: string; user: AuthUser }> = [
  {
    token: 'admin-token',
    user: {
      id: 'admin-001',
      username: 'admin_root',
      role: 'admin',
      assignedClassIds: [],
    },
  },
  {
    token: 'ta-class-1',
    user: {
      id: 'ta-001',
      username: 'ta_instructor_1',
      role: 'ta',
      assignedClassIds: ['class-1'],
    },
  },
  {
    token: 'ta-class-2',
    user: {
      id: 'ta-002',
      username: 'ta_instructor_2',
      role: 'ta',
      assignedClassIds: ['class-2'],
    },
  },
  {
    token: 'student-token',
    user: {
      id: 'std-100',
      username: 'student_user_1',
      role: 'student',
      assignedClassIds: ['class-1'],
    },
  },
  {
    token: 'student-token-2',
    user: {
      id: 'std-200',
      username: 'student_user_2',
      role: 'student',
      assignedClassIds: ['class-1'],
    },
  },
];

/** Seed on development startup or on the first use of an empty store. */
export function seedAccounts(
  store: DataStore = defaultDataStore,
  environment = process.env.NODE_ENV
): number {
  if (environment === 'production' && store.getAccountCount() > 0) return 0;

  let created = 0;
  for (const { token, user } of TEST_ACCOUNTS) {
    if (store.createAccount(token, user)) created += 1;
  }
  return created;
}
