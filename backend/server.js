const express = require('express');
const accountsRouter = require('./routes/accounts');

const expressApp = express();
const expressPort = 4000;

expressApp.use('/accounts', accountsRouter);

expressApp.get('/', (req, res) => {
  res.send('Express.js backend running!');
});

expressApp.listen(expressPort, () => {
  console.log(`Express.js backend is running on port ${expressPort}`);
});