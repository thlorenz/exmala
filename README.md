# exmala

Comparing different approaches to parse large XML messages.

## Streaming

When not buffering and writing to multiple parsers at once we risk running out of memory since all these parsers keep
a stack and other stateful things around that cost us memory.

Depending on the parser lib we use that happens at a specific level of concurrency.

#### htmlparser2

```
settings:
   { parser: 'htmlparser',
     streaming: true,
     concurrency: 1000,
     number: 2000,
     gc: false,
     file: '/Users/thlorenz/dev/js/exmala/data/ibm-request.soap.xml',
     resultsFile: '/Users/thlorenz/dev/js/exmala/results/streaming-htmlparser-c1000-n2000_ibm-request.soap.xml.json' } }
FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
```

#### xml2js 

```
{ settings:
   { parser: 'xml2js',
     streaming: true,
     concurrency: 500,
     number: 2000,
     gc: false,
     file: '/Users/thlorenz/dev/js/exmala/data/ibm-request.soap.xml',
     resultsFile: '/Users/thlorenz/dev/js/exmala/results/streaming-xml2js-c500-n2000_ibm-request.soap.xml.json' } }
FATAL ERROR: CALL_AND_RETRY_2 Allocation failed - process out of memory
```

## License

MIT
