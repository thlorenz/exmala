'use strict';

var xml2js = require('xml2js');

var go = module.exports = function (stream, cb) {
  var bufs = [];
  stream
    .on('data', ondata)
    .on('error', cb)
    .on('end', onend)

  function ondata(d) {
    bufs.push(d);
  }

  function onend() {
    var buf = Buffer.concat(bufs);
    xml2js.parseString(buf, cb);
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
