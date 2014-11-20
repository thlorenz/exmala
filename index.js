'use strict';

var assert      = require('assert-cb')
  , queue       = require('minimal-queue')
  , fs          = require('fs')
  , path        = require('path')
  , ProgressBar = require('progress')

function aggregate(result) {
  var sum = 0;
  var diffs = result.times.map(function diff_(ts) {
    var nanoSecs1 = ts.start[0] * 1E9 + ts.start[1]
      , nanoSecs2 = ts.end[0] * 1E9 + ts.end[1]

    var diff = (nanoSecs2 - nanoSecs1) / 1E6;
    sum += diff;
    return diff + ' ms';
  })

  var rsss       = result.memories.map(function getRss(x) { return x.mem.rss })
    , heapTotals = result.memories.map(function getHeapTotal(x) { return x.mem.heapTotal })
    , heapUseds  = result.memories.map(function getHeapUsed(x) { return x.mem.heapUsed })

  return {
      averageProcessing : (sum / diffs.length) + ' ms'
    , elapseds          : diffs
    , heapUseds         : heapUseds
    , heapTotals        : heapTotals
    , rsss              : rsss
    , memories          : result.memories
  }
}

var go = module.exports = function benchmark(opts, cb) {
  opts = opts || {};

  var parser      = opts.parser
    , concurrency = opts.concurrency
    , n           = opts.number
    , file        = opts.file
    , interval    = opts.interval || 1000
    , resultsFile = opts.resultsFile

  if (!assert(parser, 'need parser', cb)) return;
  if (!assert(concurrency, 'need concurrency', cb)) return;
  if (!assert(n, 'need number', cb)) return;
  if (!assert(file, 'need file', cb)) return;
  if (!assert(resultsFile, 'need resultsFile', cb)) return;

  var times = []
    , memories = []
    , bar = new ProgressBar('  processing [:bar] :percent :etas', { width: 50, total: n, complete: '=', incomplete: ' ' });

  var parse = opts.streaming
    ? require('./streaming/parse-stream')[parser]
    : require('./non-streaming/parse-stream')[parser]

  function trackMemoryUsage() {
    if (typeof gc === 'function' && !opts.nogc) {
      /*globals gc*/
      gc(); gc();
    }
    memories.push({ time: process.hrtime(), mem: process.memoryUsage() });
  }

  function processFile() {
    /* jshint validthis: true */
    var self = this;
    var stream = fs.createReadStream(file);
    var time = { start: process.hrtime(), end: null }

    function onprocessed(err, res) {
      if (err) return cb(err);
      time.end = process.hrtime();
      times.push(time);
      self.done();
      bar.tick();
    }

    if (opts.streaming)
      parse(stream, onprocessed)
    else 
      parse(stream, opts.to_s, onprocessed)
  }

  function ondone() {
    clearInterval(tok)

    var result = {
        options  : opts
      , times    : times
      , memories : memories
    }
    fs.writeFile(opts.resultsFile, JSON.stringify(aggregate(result), null, 2), 'utf8', cb)
  }

  var tok = setInterval(trackMemoryUsage, opts.interval);

  var q = queue.up(processFile);
  q.concurrency = concurrency;
  q.allDone = ondone;

  for (var i = 0; i < n; i++) {
    q.enqueue(processFile)  
  }
}
