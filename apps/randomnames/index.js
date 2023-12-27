const http = require("http");
const randomNames = require("node-random-name");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(randomNames());
});

server.listen(8082, () => {
  console.log("Server listening on port 8082");
});
