// test/post.test.js
import mongoose from 'mongoose';
import Post from '../models/Post.mjs';

describe('Post Model', function () {
  this.timeout(10000); // Extended timeout for DB operations

  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should be invalid if required fields are missing', async () => {
    const p = new Post();
    try {
      await p.validate();
      throw new Error('Expected validation error');
    } catch (err) {
      if (
        err.errors.carbrand &&
        err.errors.carmodel &&
        err.errors.caryear &&
        err.errors.carpicture
      ) return; //  Passed expected validation
      throw err; //  Wrong validation structure
    }
  });

  it('should save a complete and valid post', async () => {
    const p = new Post({
      username: 'matt',
      carbrand: 'Ford',
      carmodel: 'Explorer',
      caryear: '1999',
      carpicture: 'image.png',
      description: 'A strong SUV',
    });

    await p.validate(); // Should not throw
  });

  it('should pass validation without description', async () => {
    const p = new Post({
      username: 'matt',
      carbrand: 'Toyota',
      carmodel: 'Camry',
      caryear: '2020',
      carpicture: 'image.png',
    });

    await p.validate(); // Should not throw
  });
});
