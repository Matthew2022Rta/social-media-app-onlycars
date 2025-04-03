const chai = require('chai');
const expect = chai.expect;

describe('User Model', function() {
  it('should be able to create a user', function() {
    // Assuming you have a User model in `models/User.mjs`
    const User = require('../models/User.mjs');
    const newUser = new User({
      username: 'testuser',
      email: 'test@example.com'
    });

    expect(newUser.username).to.equal('testuser');
    expect(newUser.email).to.equal('test@example.com');
  });
});