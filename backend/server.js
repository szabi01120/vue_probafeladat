const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const uuid = require('uuid');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const accountsRouter = require('./routes/accounts');
const dbConnection = require('./services/dbConnect');

const expressApp = express();
const expressPort = 4000;

expressApp.use(cors({ origin: 'http://localhost:8080', credentials: true }));
expressApp.use(cookieParser());

//accounts route
expressApp.use('/accounts', accountsRouter);
expressApp.use(bodyParser.json());

//session adatbázis
const sessions = {};

//checkLogin middleware
function userLoggedIn(req, res, next) {
  const sessionId = req.cookies.sessionId; //session id lekérése a requestből
  console.log('sessionId1: ' + sessionId);
  if (sessions[sessionId]) {
    res.locals.accountId = sessions[sessionId].accountId; //accountId tárolása a response-ban
    res.locals.username = sessions[sessionId].username; //username tárolása a response-ban
    
    //session timeout reset
    sessions[sessionId].lastActivity = Date.now();
    
    //session timeout calculate
    const sessionTimeout = Math.floor((sessions[sessionId].lastActivity + 30 * 60 * 1000 - Date.now()) / 1000); 
    console.log('sessionTimeout: ' + sessionTimeout);
    res.append('X-Session-Timeout', sessionTimeout); //session timeout header
    
    console.log('Response headers: ', res.getHeaders());
    next();
  } else {
    res.status(401).send('Nem vagy bejelentkezve.');
  }
}

//login endpoint
expressApp.post('/login', (req, res) => {
  const { username, password } = req.body;

  const combined = username + password;
  console.log('combined: ' + combined);
  
  let hashedPassword = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);

  //felhasznalo check
  dbConnection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, hashedPassword], (err, results) => {
    if (err) {
      console.error('Hiba történt az adatbázis lekérdezésekor: ' + err.message);
      return res.status(500).send('Sikertelen bejelentkezés.');
    }
    
    if (results.length === 0) {
      return res.status(401).send('Hibás felhasználónév vagy jelszó.');
    }

    //session id generate
    const sessionId = uuid.v4();
    sessions[sessionId] = { username, accountId: results[0].id };  //session tárolás
    console.log('sessions: ' + sessionId);
    
    res.cookie('sessionId', sessionId, { maxAge: 30 * 60 * 1000 });
    res.set('X-Session-Id', sessionId); 
    res.status(200).send({ sessionId });
  });
});

//checkLogin endpoint
expressApp.get('/checkLogin', userLoggedIn, (req, res) => {// csak akkor fut le és adja vissza a username-t, ha a middleware-ben //
  res.status(200).send({ username: res.locals.username });  // lefut a next(), vagyis be van jelentkezve //
});

//logout endpoint
expressApp.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.status(200).send('Sikeres kijelentkezés.');
});

expressApp.get('/', (req, res) => {
  res.send('Express.js backend fut!');
});

expressApp.listen(expressPort, () => {
  console.log(`Express.js backend a ${expressPort}` + '-es porton fut.');
});