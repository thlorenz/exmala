'use strict'

const path = require('path')
const fs = require('fs')
const numeral = require('numeral')
const { Suite } = require('benchmark')

const { xml2js } = require('../non-streaming/parse-stream')
const ITER = 1E2

const files = [
  'amazon.wsdl'
, 'cities.xml'
, 'ibm-request.soap.xml'
, 'openformat-engell.soap.xml'
, 'web-account-service.wsdl'
].map(x => path.join(__dirname, '..', 'data', x))

const suite = new Suite()
files.forEach(x => suite.add(path.basename(x), {
    defer: true
  , minSamples: ITER
  , fn: deferred => {
      const stream = fs.createReadStream(x)
      xml2js(stream, false, deferred.resolve.bind(deferred))
    }
  })
)

suite
  .on('cycle', function(event) {
    const t = event.target
    console.log(
      `${t.name.padEnd(30)}` +
      `${numeral(t.hz).format('0,0')} ops/sec ` +
      `±${t.stats.rme.toFixed(2)}% ` +
      `(${t.stats.sample.length} runs sampled)`
    )
  })
  .run({ async: true })
