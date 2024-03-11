const mysql = require('mysql2');

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

module.exports = dbConnection;
