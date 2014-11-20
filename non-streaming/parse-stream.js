'use strict';

var xml2js = require('xml2js')
  , htmlparser = require('htmlparser2')

exports.xml2js = function xml2js_(stream, cb) {
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

exports.htmlparser = function htmlparser_(stream, cb) {
  var bufs = [];
  var handler = new htmlparser.DomHandler();
  var parser = new htmlparser.Parser(handler);

  stream
    .on('data', ondata)
    .on('error', cb)
    .on('end', onend)

  function ondata(d) {
    bufs.push(d);
  }

  function onend() {
    var buf = Buffer.concat(bufs);
    parser.end(buf)
    cb(null, handler.dom)
  }
}

if (module.parent) return;
  
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function cb(err, res) {
  if (err) return console.error(err);
  
  inspect(arguments);
}

var fs = require('fs')  
  , path = require('path')
  , file = path.join(__dirname, '..', 'data', 'openformat-engell.soap.xml');

exports.htmlparser(fs.createReadStream(file), function (err, res) {
  if (err) return console.error(err);
  inspect(res, 10);
});
