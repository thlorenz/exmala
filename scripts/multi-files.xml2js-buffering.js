'use strict'

const benchmark = require('../')
const path = require('path')

const ITER = 10
const CONCURRENCY = 5

const baseOpts = {
    parser: 'xml2js'
  , concurrency: CONCURRENCY
  , number: ITER
  , streaming: false
  , gc: false
  , resultsFile: null
}

const files = [
  'cities.xml'
, 'ibm-request.soap.xml'
, 'openformat-engell.soap.xml'
].map(x => path.join(__dirname, '..', 'data', x))

function run(err) {
  if (err) return console.error(err)

  const file = files.pop()
  if (file == null) return
  const opts = Object.assign({}, baseOpts, { file })
  benchmark(opts, run)
}

run()
