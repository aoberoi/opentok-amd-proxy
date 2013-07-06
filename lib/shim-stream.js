var Transform = require('stream').Transform;

function ShimStream(options) {
  if (!this instanceof ShimStream)) {
    return new ShimStream(options);
  }

  Transform.call(this, options);

  this._onFirst = false;

  this._prefixString = 'xxxxxxxx';
  this._suffixString = 'yyyyyyyy';
}

ShimStream.prototype = Object.create( Transform.prototype,
    { constructor: { value : ShimStream } });

ShimStream.prototype._transform = function(chunk, encoding, done) {
  var output = '';
  if (this._onFirst) {
    // prepend the beginning of the shim
    output += this._prefixString;
    this._onFirst = false;
  }

  output += chunk.toString();

  this.push(new Buffer(output));

  done();
}

ShimStream.prototype._flush = function(done) {
  this.push(_suffixString);
  done();
}

module.exports = ShimStream;