// test/user.test.js
import mongoose from 'mongoose';
import User from '../models/User.mjs';

describe('User Model', function () {
  this.timeout(10000); // extend timeout

  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should be invalid with no username', async () => {
    const u = new User();
    try {
      await u.validate();
      throw new Error('Expected username validation error');
    } catch (err) {
      if (err.errors.username) return; // ✅ success
      throw err;
    }
  });
});