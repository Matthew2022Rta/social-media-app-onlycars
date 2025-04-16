// test/post.test.js
//added tests
import mongoose from 'mongoose';
import Post from '../models/Post.mjs';

describe('Post Model', function () {
  // Connect before all tests
  before(async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
  });

  // Disconnect and cleanup DB
  after(async function () {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should be invalid if required fields are missing', function (done) {
    const p = new Post();

    p.validate((err) => {
      if (
        err &&
        err.errors.carbrand &&
        err.errors.carmodel &&
        err.errors.caryear &&
        err.errors.carpicture
      ) {
        return done(); // ✅ test passes
      }
      done(new Error('Missing expected validation errors'));
    });
  });

  it('should save a complete and valid post', function (done) {
    const p = new Post({
      username: 'matt',
      carbrand: 'Ford',
      carmodel: 'Explorer',
      caryear: '1999',
      carpicture: 'image.png',
      description: 'A strong SUV'
    });

    p.validate((err) => {
      if (err) return done(err);
      done(); // ✅ test passes
    });
  });

  it('should pass validation without description', function (done) {
    const p = new Post({
      username: 'matt',
      carbrand: 'Toyota',
      carmodel: 'Camry',
      caryear: '2020',
      carpicture: 'image.png'
    });

    p.validate((err) => {
      if (err) return done(err);
      done(); 
    });
  });
});
//added post tests