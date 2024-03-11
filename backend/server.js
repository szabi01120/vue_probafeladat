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

//routes
expressApp.use('/accounts', accountsRouter);
expressApp.use(bodyParser.json());

let currentIP = null;
console.log('currentIP: ' + currentIP);

//ip address check
expressApp.use((req, res, next) => {
  const clientIP = req.ip;
  console.log('clientIP: ' + clientIP);
  if (!currentIP) {
    currentIP = clientIP;
    next();
  } else {
    if (currentIP !== clientIP) {
      //amint megvaltozik az ip toroljuk a sessiont, es a cookie-t
      const sessionId = req.cookies.sessionId;
      if (sessions[sessionId]) {
        delete sessions[sessionId];
      }
      res.clearCookie('sessionId');
      res.status(401).send('Az IP cím megváltozott, ki lettél jelentkeztetve.');
    } else {
      next();
    }
  }
});

//session adatbázis
const sessions = {};

//login endpoint
expressApp.post('/login', (req, res) => {
  var { username, password } = req.body;

  const combined = username + password;
  console.log('combined: ' + combined);
  
  hashedPassword = CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);

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
    sessions[sessionId] = { username };
    console.log('sessions: ' + sessionId);
    res.cookie('sessionId', sessionId);

    res.status(200).send({ sessionId });
  });
});

//checkLogin endpoint
expressApp.get('/checkLogin', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessions[sessionId]) {
    res.status(200).send({username: sessions[sessionId].username });
  }
  else {
    res.status(401).send('Nem vagy bejelentkezve.');
  }
});

expressApp.get('/', (req, res) => {
  res.send('Express.js backend fut!');
});

expressApp.listen(expressPort, () => {
  console.log(`Express.js backend a ${expressPort}` + '-es porton fut.');
});