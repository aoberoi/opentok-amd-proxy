var http = require('http');
var ShimStream = require('./lib/shim-stream');

var server = http.createServer(function(req, res) {
  // create a shim stream
  var ss = new ShimStream();

  http.get('http://static.opentok.com/v1.1/js/TB.min.js', function(remoteRes) {
    remoteRes.pipe(ss).pipe(res);
  });
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});


