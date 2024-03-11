const express = require('express');
const dbConnection = require('../services/dbConnect'); // Importáljuk a db.js-t a services mappából

const router = express.Router();

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
