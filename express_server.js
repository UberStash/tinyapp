const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs')



const users = {};

const createUser = (user_id, email, password) => {
  users[user_id] = {
  user_id,
  email,
  password
  }
}

const generateRandomString = function() {
return Math.random().toString(36).substring(8)
}

const validateLogin = (password, email) => {
  if (!password) {
     throw new Error('400 You can not leave the password blank!')
  }
     for (const u in users) {
      if (validateEmail(email) && users[u].password === password) {
        return users[u].user_id;
      }
    } 
    throw new Error('302 Wrong email or password combination!');
  
}


const validateEmail = (email) => {
  if (!email) {
     throw new Error('400 You can not leave the registration blank!')
  }
  
  for (const u in users) {
    if (users[u].email === email) {
      return true;
    }
  } 
  return false;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const user_id = validateLogin(password, email)
  if (user_id) {
    res.cookie('user_id', user_id);
    res.redirect("/urls")
  } else {
    res.redirect("/login")

  }
})

app.post('/logout', (req, res) => {
  const user_id = req.headers
  res.clearCookie('user_id');
  res.redirect("/urls")
})

app.post('/register', (req, res) => {
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
 
 if(!validateEmail(email)){
   createUser(user_id, email, password)
 res.cookie('user_id', user_id);
 res.redirect("/urls")
 } else {
   res.send('Error email is already in use')
 }
})


app.get("/register", (req, res) => {
  let templateVars = {
    user_id: ''
  };
  res.render('urls_register', templateVars);
});

////change below

app.get("/urls/new", (req, res) => {
  
  const userID = req.cookies["user_id"];
  let templateVars = {};
  if (userID) {
    console.log('false')
    templateVars.user_id = users[req.cookies["user_id"]].email
  } else {
    templateVars.user_id = ''
};
  res.render('urls_new', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {  
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect(`/urls`);
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  
  let templateVars = {
    urls: urlDatabase,
  }
      if (userID) {
        
        templateVars.user_id = users[req.cookies["user_id"]].email
      } else {
        templateVars.user_id = ''
    };

  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  let urlID = generateRandomString()
  urlDatabase[urlID] = req.body.longURL;
  //res.send('Got it ;)')
  res.redirect(`/urls/${urlID}`);
});

app.post('/urls/:shortURL', (req, res) => {
  const editID = req.params.shortURL;
  urlDatabase[editID] = req.body.longURL;
  res.redirect('/urls');
  
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"]
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { 
    shortURL, 
    longURL,
  };

  if (userID) {
    
    templateVars.user_id = users[req.cookies["user_id"]].email
  } else {
    templateVars.user_id = ''
};

  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL];
  
  if (!longURL.includes('http://')) {
  longURL = 'http://' + longURL;
  }
  res.redirect(`${longURL}`);
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