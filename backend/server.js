const express = require('express');
const mysql = require('mysql2');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const accountsRouter = require('./routes/accounts');

const expressApp = express();
const expressPort = 4000;

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

// Felhasználók adatbázisa
const users = [
  {
      username: 'user1',
      password: 'password1'
  },
  {
      username: 'user2',
      password: 'password2'
  }
];

//session adatbázis
const sessions = {};

//login endpoint
expressApp.post('/login', (req, res) => {
  const { username, password } = req.body;

  //felhasználó check
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
      return res.status(401).send('Hibás felhasználónév vagy jelszó.');
  }

  //session ID generálás
  const sessionId = uuid.v4();
  sessions[sessionId] = { username };
  res.set('Set-Cookie', `sessionId=${sessionId}`);

  res.send({ sessionId });
});

//regisztráció endpoint
expressApp.post('/register', (req, res) => {
  const { username, password } = req.body;

  //felh név check
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).send('A felhasználónév már foglalt.');
  }

  //felh hozzáadás push
  dbConnection.query('INSERT INTO accounts (accountId, username, password, serial, characterName, email) VALUES (?, ?, ?, ?, ?, ?)', 
      [10, username, password, "serial", "charname", "email1"], (err, result) => {

    if (err) {
      console.error('Hiba történt az adatbázisba történő beszúrás során ' + err.message);
      return res.status(500).send('Sikertelen regisztráció.');
    }
    console.log('Sikeresen hozzáadva az adatbázishoz.', result)
    res.send('Sikeres regisztráció.');
  });
});

expressApp.get('/', (req, res) => {
  res.send('Express.js backend fut!');
});

expressApp.listen(expressPort, () => {
  console.log(`Express.js backend a ${expressPort}` + '-es porton fut.');
});