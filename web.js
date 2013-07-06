var http = require('http');
var ShimStream = require('./lib/shim-stream');

var server = http.createServer(function(req, res) {
  //http.get('', function(remoteRes) {
  //  remoteRes.pipe(shimStream()).pipe(res);
  //});

  // create a shim stream
  var ss = new ShimStream();

  ss.pipe(res);

  ss.end('hello');
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});


