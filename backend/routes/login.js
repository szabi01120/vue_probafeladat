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

//session adatbázis
const sessions = {};

//login endpoint
router.post('/', (req, res) => {
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

module.exports = router;