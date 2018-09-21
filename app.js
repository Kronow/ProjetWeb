var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.write('Salut tout le monde !');

  res.end();
});
server.listen(8080);