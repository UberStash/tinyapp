const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs')


const generateRandomString = function() {
return Math.random().toString(36).substring(8)
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls")
})

app.post('/logout', (req, res) => {
  const username = req.headers
  console.log(username)
  res.clearCookie(`username`);
  res.redirect("/urls")
})

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render('urls_new', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {  
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect(`/urls`);
});

app.get("/urls", (req, res) => {
  
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies['username']
    };

    console.log(templateVars)
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
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  templateVars = { shortURL, 
    longURL,
    username: req.cookies['username']
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