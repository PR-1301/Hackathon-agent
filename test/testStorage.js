import 'dotenv/config';
import { hasSeen, markSeen } from '../src/storage.js';

async function testStorage() {
  const fakeUID = 'test-uid-123';

  // 1. Should be false initially
  const firstCheck = await hasSeen(fakeUID);
  console.log('First check:', firstCheck); // false

  // 2. Mark as seen
  await markSeen(fakeUID);
  console.log('UID marked as seen');

  // 3. Should now return true
  const secondCheck = await hasSeen(fakeUID);
  console.log('Second check:', secondCheck); // true
}

testStorage().catch(console.error);