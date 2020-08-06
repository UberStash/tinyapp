const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['TheMonkey Is BRown', 'Baby Beluga In the deeeeeep blue sea']
}))
app.set('view engine', 'ejs');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users = {};


const createUser = (user_id, email, password) => {
  users[user_id] = {
    user_id,
    email,
    password
  };
};

const generateRandomString = function() {
  return Math.random().toString(36).substring(8);
};

const validateLogin = (password, email) => {
  
  
if (!password) {
    throw new Error('400 You can not leave the password blank!');
  }
  for (const u in users) {
    if (validateEmail(email) && bcrypt.compareSync(password, users[u].password)) {
      return users[u].user_id;
    }
  }
  return false;
  
};


const validateEmail = (email) => {
  if (!email) {
    throw new Error('400 You can not leave the registration blank!');
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      return true;
    }
  }
  
  return false;
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID:"aJ48lW"}
  
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  let templateVars = {
    user_id: ""
  };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = validateLogin(password, email);
  if (user_id) {
    req.session.user_id = user_id;;
    res.redirect("/urls");
  } else {
    res.redirect("/login");

  }
});

app.post('/logout', (req, res) => {
  const user_id = req.headers;
  res.clearCookie('user_id');
  res.redirect("/login");
});

app.post('/register', (req, res) => {
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, salt);
 
  if (!validateEmail(email)) {
    createUser(user_id, email, password);
    req.session.user_id = user_id;
    res.redirect("/urls");
  } else {
    res.send('Error email is already in use');
  }
});


app.get("/register", (req, res) => {
  let templateVars = {
    user_id: ''
  };
  res.render('urls_register', templateVars);
});

////change below

app.get("/urls/new", (req, res) => {
  
  const userID = req.session["user_id"];
  let templateVars = {};
  if (userID) {
    templateVars.user_id = users[req.session["user_id"]].email;
  } else {
    res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  if (userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect(`/urls`);
  } else {
    res.redirect(`/urls`);
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  let userDatabase = {};
  console.log(users);
  for (let url in urlDatabase) {
    
    if (urlDatabase[url].userID === userID) {
      userDatabase[url] = urlDatabase[url];
    }
  }
  let templateVars = {
    urls: userDatabase,
  };
  if (userID) {
        
    templateVars.user_id = users[req.session["user_id"]].email;
  } else {
    templateVars.user_id = '';
  }
  if (!userID) res.redirect('/login');
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  let urlID = generateRandomString();
  const userID = req.session["user_id"];
  urlDatabase[urlID] = {longURL: req.body.longURL, userID,};
  //res.send('Got it ;)')
  res.redirect(`/urls/${urlID}`);
});

app.post('/urls/:shortURL', (req, res) => {
  const editID = req.params.shortURL;
  urlDatabase[editID].longURL = req.body.longURL;
  res.redirect('/urls');
  
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  
  if (userID) {
  
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = {
      shortURL,
      longURL
    };

    if (userID) {
    
      templateVars.user_id = users[req.session["user_id"]].email;
    } else {
      templateVars.user_id = '';
    }

    res.render('urls_show', templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  
  if (longURL.includes('http://' || 'https://')) {
    res.redirect(longURL);
  } else {
  longURL = 'http://' + longURL;
    res.redirect(longURL);
  }
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});