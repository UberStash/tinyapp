const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {validateEmail, validateLogin, generateRandomString, createUser} = require('./helper');

// sets middleware usage
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['TheMonkey Is BRown', 'Baby Beluga In the deeeeeep blue sea']
}));
app.set('view engine', 'ejs');

// sets bcrypt settings
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// USER DATABASE
const users = {};


// URL DATABASE
const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID:'aJ48lW'}
  
};


// sets homepage as urls which will redirect to login if not logged in
app.get('/', (req, res) => {
  res.redirect('/urls');
});
// login page request and render
app.get('/login', (req, res) => {
  let templateVars = {
    user_id: ''
  };
  res.render('urls_login', templateVars);
});
// login page post which logs in the user and checks email and password
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = validateLogin(password, email, users);
  if (user_id) {
    req.session.user_id = user_id;
    res.redirect('/urls');
  } else {
    res.redirect('/login');

  }
});

// logout when button clicked
app.post('/logout', (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/login');
});

// render register page
app.get('/register', (req, res) => {
  let templateVars = {
    user_id: ''
  };
  res.render('urls_register', templateVars);
});

// register user in users database
app.post('/register', (req, res) => {
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, salt);
 
  if (!validateEmail(email, users)) {
    createUser(user_id, email, password, users);
    req.session.user_id = user_id;
    res.redirect('/urls');
  } else {
    res.send('Error email is already in use');
  }
});


// renders new url page
app.get('/urls/new', (req, res) => {
  
  const userID = req.session['user_id'];
  let templateVars = {};
  if (userID) {
    templateVars.user_id = users[req.session['user_id']].email;
  } else {
    res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});

// deletes url out of urls database
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session['user_id'];
  const shortURL = req.params.shortURL;
  if (userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect(`/urls`);
  } else {
    res.redirect(`/urls`);
  }
});

// renders url_index based on logged in status
app.get('/urls', (req, res) => {
  const userID = req.session['user_id'];
  let userDatabase = {};
  
  for (let url in urlDatabase) {
    
    if (urlDatabase[url].userID === userID) {
      userDatabase[url] = urlDatabase[url];
    }
  }
  let templateVars = {
    urls: userDatabase,
  };
  if (userID) {
        
    templateVars.user_id = users[req.session['user_id']].email;
  } else {
    templateVars.user_id = '';
  }
  if (!userID) res.redirect('/login');
  res.render('urls_index', templateVars);
});

// creates new url in urls database
app.post('/urls', (req, res) => {
  let urlID = generateRandomString();
  const userID = req.session['user_id'];
  urlDatabase[urlID] = {longURL: req.body.longURL, userID,};
  res.redirect(`/urls/${urlID}`);
});

// edits existing urls in database using url id
app.post('/urls/:shortURL', (req, res) => {
  const editID = req.params.shortURL;
  urlDatabase[editID].longURL = req.body.longURL;
  res.redirect('/urls');
  
});

//displays the short url page and also edit if not logged in will redirect to login
app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session['user_id'];
  
  if (userID) {
  
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = {
      shortURL,
      longURL
    };

    if (userID) {
    
      templateVars.user_id = users[req.session['user_id']].email;
    } else {
      templateVars.user_id = '';
    }

    res.render('urls_show', templateVars);
  } else {
    res.redirect('/login');
  }
});

// makes short urls in page redirect to listed long url and appends the http:// if not provided
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  
  if (longURL.includes('http://' || 'https://')) {
    res.redirect(longURL);
  } else {
    longURL = 'http://' + longURL;
    res.redirect(longURL);
  }
});

// DO NOT NEED BUT LEFT ANYWAYS!!!
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// sets up listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});