'use strict';

var xml2js = require('xml2js');

var go = module.exports = function (stream, cb) {
  var bufs = [];
  var parser = new xml2js.Parser();

  parser.on('error', cb)
  stream
    .on('error', cb)
    .on('data', ondata)
    .on('end', onend)

  function ondata(d) {
    parser.saxParser.write(d.toString())  
  }

  function onend() {
    cb(null, parser.resultObject);
  }
}

//if (module.parent) return;
  
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

var fs = require('fs')  
  , path = require('path')
  , file = path.join(__dirname, '..', 'data', 'openformat-engell.soap.xml');


go(fs.createReadStream(file), function (err, res) {
  if (err) return console.error(err);
  inspect(res, 100);
});

