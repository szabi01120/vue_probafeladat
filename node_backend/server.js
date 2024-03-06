const http = require('http');

const nodeServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Node.js backend running!\n');
});

const nodePort = 3333;
nodeServer.listen(nodePort, () => {
  console.log(`Node.js backend is running on port ${nodePort}`);
});