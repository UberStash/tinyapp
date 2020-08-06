const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


// CREATES NEW USER
const createUser = (user_id, email, password, users) => {
  users[user_id] = {
    user_id,
    email,
    password
  };
};

// generates random ids
const generateRandomString = function() {
  return Math.random().toString(36).substring(8);
};

// takes in validate email and compares passwords
// takes in validate email and compares passwords
const validateLogin = (password, email, users) => {
  console.log('password', password)
  console.log('email', email)
  
  if (!password) {
      throw new Error('400 You can not leave the password blank!');
    }
     const user = fetchUserByEmail(email, users);
      if ( user && bcrypt.compareSync(password, user.password)) {
        return user.user_id;
      }
    
    return false;
    
  };

// check if email is correct or exists or not enetered
const validateEmail = (email, users) => {
  if (!email) {
    return Error('400 email is empty');
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      return true;
    }
  }
  
  return false;
};

const fetchUserByEmail = (email, users) => {
  if (!email) {
    return Error('400 email is empty');
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      
      return users[u];
    }
  }
  
  return false;
};


module.exports = {validateEmail, validateLogin, fetchUserByEmail, generateRandomString, createUser};
