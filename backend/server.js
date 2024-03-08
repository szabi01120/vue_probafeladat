const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const uuid = require('uuid');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const accountsRouter = require('./routes/accounts');

const expressApp = express();
const expressPort = 4000;

expressApp.use(cors({ origin: 'http://localhost:8080', credentials: true }));

expressApp.use('/accounts', accountsRouter);
expressApp.use(bodyParser.json());

//parameterek mysql
const dbConnection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3030,
  user: 'root',
  password: 'root',
  database: 'mydatabase'
});

//connection
dbConnection.connect((err) => {
  if (err) {
    console.error('Hiba az adatbázis való csatlakozáskor: ' + err.stack);
    return;
  }
  console.log('Sikeres csatlakozás az adatbázishoz.');
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
    
    const user = results[0];
    
    //session id generate
    const sessionId = uuid.v4();
    sessions[sessionId] = { username };
    res.set('Set-Cookie', `sessionId=${sessionId}`);

    res.status(200).send({ sessionId });
  });
});

expressApp.get('/', (req, res) => {
  res.send('Express.js backend fut!');
});

expressApp.listen(expressPort, () => {
  console.log(`Express.js backend a ${expressPort}` + '-es porton fut.');
});