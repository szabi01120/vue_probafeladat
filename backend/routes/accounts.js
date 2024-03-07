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

//express route
router.get('/', (req, res) => {
  dbConnection.query('SELECT * FROM accounts', (err, rows) => {
    if (err) {
      console.error('Hiba a lekérdezés során: ' + err.stack);
      return;
    }
    res.json(rows);
  });
});

module.exports = router;