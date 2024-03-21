const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const uuid = require('uuid');
const CryptoJS = require('crypto-js');

const accountsRouter = require('./routes/accounts');
const dbConnection = require('./services/dbConnect');
const sendCodeToEmail = require('./services/sendMail');

const expressApp = express();
const expressPort = 4000;

const SERVER_IP = '192.168.0.133';

expressApp.use(cors({ origin: 'http://192.168.0.133:8080', credentials: true }));
expressApp.use(cookieParser());

//routes
expressApp.use('/accounts', accountsRouter);
expressApp.use(bodyParser.json());

//session adatbázis
const sessions = {};

//checkLogin middleware
function userLoggedIn(req, res, next) {
  const sessionId = req.get('x-session-id'); //session id lekérése a requestből
  console.log('sessionId in userloggedin: ' , sessionId);
  if (sessions[sessionId]) {
    res.locals.accountId = sessions[sessionId].account; //accountId tárolása a response-ban
    res.locals.username = sessions[sessionId].username; //username tárolása a response-ban
    res.locals.ip = sessions[sessionId].ip; //ip tárolása a response-ban
    console.log('userIp: ' , res.locals.ip);
    next();
  } else {
    res.clearCookie('sessionId');
    res.clearCookie('sessionTimeout');
    res.status(401).send('Nem vagy bejelentkezve.');
  }
}

//logout function
function userLogout(req, res) {
  try {
    const sessionId = req.get('x-session-id');
    delete sessions[sessionId]; //session törlése
    res.clearCookie('sessionId');
    res.clearCookie('sessionTimeout');
    console.log('sikeres kijelentkezes');
    res.status(200).send('Sikeres kijelentkezés.');
  } catch (error) {
    res.status(500).send('Sikertelen kijelentkezés.');
  }
}

//ip cím ellenőrzése
function checkIpChange(req, res) { 
  const sessionId = req.get('x-session-id');
  const currentIp = req.ip;
  console.log('current ip: ' , currentIp);
  console.log('session ip: ' , sessions[sessionId].ip);

  if (sessions[sessionId] && sessions[sessionId].ip !== currentIp) {
    userLogout(req, res);
  }
};

//6 számjegyű kód generálás
let twoFactorCode = 0;

//login endpoint
expressApp.post('/login', (req, res) => {
  const { username, password } = req.body;
  const combined = username + password; //username és password összefűzése
  
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
    
    //session tároláshoz az értékek
    const email = results[0].email;
    const accountId = results[0].accountId;

    twoFactorCode = Math.floor(100000 + Math.random() * 900000); //6 számjegyű kód generálás 
    sendCodeToEmail(email, twoFactorCode); //email küldés

    res.status(200).send({ accountId }); //2fa szükséges
  });
});

//2FA verify endpoint
expressApp.post('/verify', (req, res) => {
  const { verificationCode, username, accountId } = req.body;
  
  if (String(twoFactorCode) !== verificationCode) {
    return res.status(401).send('Hibás 2FA kód.'); 
  }

  //ip cím tárolása
  const ip = req.socket.remoteAddress;
  console.log('ip: ' , ip);

  //session timeout calculate
  const sessionTimeout = Math.floor((Date.now() + 30 * 60 * 1000 - Date.now()) / 1000);
  
  //session id generate
  const sessionId = uuid.v4();
  sessions[sessionId] = { 
    account: accountId,
    ip: ip, 
    timeout: sessionTimeout,
    username: username,
    sessionId: sessionId, 
    user2FA: verificationCode,
  };  //session tárolás
  
  res.set('X-Session-Timeout', sessionTimeout); //session timeout header

  res.status(200).send({ sessionId, sessionTimeout }); //helyes 2fa eseten login
});

//checkLogin endpoint
expressApp.get('/checkLogin', userLoggedIn, (req, res) => {// csak akkor fut le és adja vissza a username-t, ha a middleware-ben //
  checkIpChange(req, res);
  res.status(200).send({ username: res.locals.username});  // lefut a next(), vagyis be van jelentkezve //
});

//logout endpoint
expressApp.post('/logout', (req, res) => {
  userLogout(req, res);
});

expressApp.get('/', (req, res) => {
  res.send('Express.js backend fut!');
});

expressApp.listen(expressPort, SERVER_IP, () => {
  console.log(`Express.js backend a ${expressPort}` + '-es porton fut.');
});