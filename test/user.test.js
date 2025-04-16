import mongoose from 'mongoose';
import User from '../models/User.mjs';

describe('User Model', function () { 
   before(async function () {
     await mongoose.connect('mongodb://127.0.0.1:27017/test');
  });

  after(async function () {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

   it('should be invalid with no username', function (done) {
     const u = new User();

     u.validate((err) => {
       if (err && err.errors.username) done(); // ✅ test passes
       else done(new Error('Expected username error'));
     });
   });
});
//added the user tests