var http = require('http');
var ShimStream = require('./lib/shim-stream');

var server = http.createServer(function(req, res) {

  // Decide the script URL we are going to proxy
  var scriptUrl;
  if ( req.url === '/v1.1/js/TB.min.js' ||
       req.url === '/webrtc/v2.0/js/TB.min.js' ) {
    scriptUrl = 'http://static.opentok.com' + req.url;
  } else {
    // 404: this isn't one of the scripts we proxy
    res.writeHead(404, 'not a script this server can proxy');
    res.end();
    return;
  }

  // create a shim stream
  var ss = new ShimStream();

  // get the remote javascript
  http.get('http://static.opentok.com/v1.1/js/TB.min.js', function(remoteRes) {
    // set the response headers
    for (var header in remoteRes.headers) {
      res.setHeader(header, remoteRes.headers[header]);
    }

    // pipe the transformed javascript back as the response
    remoteRes.pipe(ss).pipe(res);
  });
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});


