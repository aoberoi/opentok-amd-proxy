// Dependencies
var Transform = require('stream').Transform;

/*
 * ShimStream is a kind of Transform stream that takes
 * in javascript on one end and transforms it into
 * javascript with an AMD wrapper at the output.
 */
function ShimStream(options) {
  // be lenient with 'new' keyword
  if (!(this instanceof ShimStream)) {
    return new ShimStream(options);
  }

  // super
  Transform.call(this, options);

  // internal state
  this._onFirst = true;
  this._prefixString = prefixTemplate(); // TODO: dependencies support
  this._suffixString = suffixTemplate();
}

// inherit from stream.Transform
ShimStream.prototype = Object.create( Transform.prototype,
    { constructor: { value : ShimStream } });

ShimStream.prototype._transform = function(chunk, encoding, done) {
  var output = '';

  // prepend the beginning of the shim
  if (this._onFirst) {
    output += this._prefixString;
    this._onFirst = false;
  }

  output += chunk.toString();
  this.push(new Buffer(output));
  done();
}

ShimStream.prototype._flush = function(done) {
  // append the end of the shim
  this.push(this._suffixString);
  done();
}

// TODO: dependencies support
function prefixTemplate() {
  return '(function (factory) { if (typeof define === \'function\' && define.amd) { define(factory); } else { factory(); } }(function () {\n';
}

function suffixTemplate() {
  return '\n}));';
}

module.exports = ShimStream;
