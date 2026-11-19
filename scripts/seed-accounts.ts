import 'dotenv/config';
import { seedAccounts } from '../src/store/seed-accounts.js';

// The store is in memory; server startup seeds its own shared store as well.
const created = seedAccounts();
console.log(`Seeded ${created} test accounts into the in-memory store.`);
