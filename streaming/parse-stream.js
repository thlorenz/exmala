'use strict';

var xml2js = require('xml2js')
  , htmlparser = require('htmlparser2')

exports.xml2js = function xml2js_(stream, cb) {
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
    parser.saxParser.end();
    cb(null, parser.resultObject);
  }
}

exports.htmlparser = function htmlparser2_(stream, cb) {
  var bufs = [];
  var handler = new htmlparser.DomHandler();
  var parser = new htmlparser.Parser(handler);

  parser.on('error', cb)
  stream
    .on('error', cb)
    .on('data', ondata)
    .on('end', onend)

  function ondata(d) {
    parser.write(d.toString())  
  }

  function onend() {
    parser.end();
    cb(null, handler.dom);
  }
}

if (module.parent) return;
  
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

var fs = require('fs')  
  , path = require('path')
  , file = path.join(__dirname, '..', 'data', 'openformat-engell.soap.xml')
  , stream = fs.createReadStream(file);


exports.htmlparser(fs.createReadStream(file), function (err, res) {
  if (err) return console.error(err);
  inspect(res, 10);
});
