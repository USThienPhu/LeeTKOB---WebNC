import { describe, expect, it } from 'vitest';
import { DataStore } from '../../src/store/data-store.js';
import { seedAccounts } from '../../src/store/seed-accounts.js';

describe('seedAccounts', () => {
  it('seeds all five accounts on first production startup', () => {
    const store = new DataStore();
    expect(seedAccounts(store, 'production')).toBe(5);
    expect(store.getAccountCount()).toBe(5);
    expect(store.getAccountByToken('admin-token')?.role).toBe('admin');
    expect(store.getAccountByToken('ta-class-1')?.assignedClassIds).toEqual([
      'class-1',
    ]);
    expect(store.getAccountByToken('ta-class-2')?.assignedClassIds).toEqual([
      'class-2',
    ]);
    expect(store.getAccountByToken('student-token')?.id).toBe('std-100');
    expect(store.getAccountByToken('student-token-2')?.id).toBe('std-200');
    expect(seedAccounts(store, 'production')).toBe(0);
  });

  it('fills missing development accounts without replacing existing users', () => {
    const store = new DataStore();
    const existing = {
      id: 'custom-admin',
      username: 'custom',
      role: 'admin' as const,
      assignedClassIds: ['custom-class'],
    };
    store.createAccount('admin-token', existing);
    expect(seedAccounts(store, 'development')).toBe(4);
    expect(seedAccounts(store, 'development')).toBe(0);
    const snapshot = store.getAccountByToken('admin-token');
    snapshot!.assignedClassIds.push('changed');
    expect(store.getAccountByToken('admin-token')).toEqual(existing);
    expect(store.getAccountByToken('invalid')).toBeNull();
  });

  it('does not add demo accounts to an initialized production store', () => {
    const store = new DataStore();
    store.createAccount('existing-token', {
      id: 'existing',
      username: 'existing',
      role: 'admin',
      assignedClassIds: [],
    });
    expect(seedAccounts(store, 'production')).toBe(0);
    expect(store.getAccountCount()).toBe(1);
    expect(store.getAccountByToken('admin-token')).toBeNull();
  });
});
