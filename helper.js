const bcrypt = require('bcrypt');




// CREATES NEW USER
const createUser = (user_id, email, password, users) => {
  users[user_id] = {
    user_id,
    email,
    password
  };
};

// GENERATES RANDOM ID
const generateRandomString = function() {
  return Math.random().toString(36).substring(8);
};


// CALLS FETCH USER AND COMPARES USERS PASSWORD
const validateLogin = (password, email, users) => {
  console.log('password', password);
  console.log('email', email);
  
  if (!password) {
    return Error('400 password is empty!');
  }
  const user = fetchUserByEmail(email, users);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user.user_id;
  }
    
  return false;
    
};

// check if email is correct or exists or not enetered returns true or false
const validateEmail = (email, users) => {
  if (!email) {
    return Error('ERROR 400 empty email!');
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      return true;
    }
  }
  
  return false;
};

// check if email is correct or exists or not enetered returns correct user object or false
const fetchUserByEmail = (email, users) => {
  if (!email) {
    return Error('ERROR 400 email is empty');
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      
      return users[u];
    }
  }
  
  return false;
};


module.exports = {validateEmail, validateLogin, fetchUserByEmail, generateRandomString, createUser};
