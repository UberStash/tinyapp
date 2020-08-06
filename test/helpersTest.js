const { assert } = require('chai');


const {validateEmail, fetchUserByEmail} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    user_id: "userRandomID", 
    email: "user@example.com", 
    password: "$2b$10$3amD.UNuCyynNmMt3128HeL3mWoXAX8oAB96s5NQT8onlJ3jf3tZm"
  },
  "user2RandomID": {
    user_id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


/// fetchUserByEmail tests

describe('fetchUserByEmail', function() {
  it('should return a user with valid email when given valid email', function() {
    const user = fetchUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.deepEqual(user, expectedOutput);
  });
});

describe('fetchUserByEmail', function() {
  it('should return false when given string with white space', function() {
    const user = fetchUserByEmail(" ", testUsers)
    const expectedOutput = false;
    assert.deepEqual(user, expectedOutput);
  });
});

describe('fetchUserByEmail', function() {
  it('should return an error with no email', function() {
    const user = fetchUserByEmail("", testUsers);
    const expectedOutput = 'Error: 400 email is empty';
    assert.equal(user, expectedOutput);
  });
});

describe('fetchUserByEmail', function() {
  it('should return false with wrong email', function() {
    const user = fetchUserByEmail("ghghghg", testUsers)
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

// validateEmail tests

describe('validateEmail', function() {
  it('should return true with valid email when given valid email', function() {
    const user = validateEmail("user@example.com", testUsers)
    const expectedOutput = true;
    assert.deepEqual(user, expectedOutput);
  });
});

describe('validateEmail', function() {
  it('should return false when given invalid email', function() {
    const user = validateEmail("u@example.com", testUsers)
    const expectedOutput = false;
    assert.deepEqual(user, expectedOutput);
  });
});

describe('validateEmail', function() {
  it('should return an error with no email', function() {
    const user = validateEmail("", testUsers);
    const expectedOutput = 'Error: 400 email is empty';
    assert.equal(user, expectedOutput);
  });
});

describe('validateEmail', function() {
  it('should return false with wrong email', function() {
    const user = validateEmail("ghghghg", testUsers)
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

