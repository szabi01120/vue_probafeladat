const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

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

//regisztráció endpoint
router.post('/', (req, res) => {
    const { username, password } = req.body;
  
    //felh név check
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).send('A felhasználónév már foglalt.');
    }
  
    //felh hozzáadás push
    const newUser = { username, password };
    users.push(newUser);
  
    res.send('Sikeres regisztráció.');
  });

module.exports = router;