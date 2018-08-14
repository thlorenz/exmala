#!/usr/bin/env bash

echo "If ulimit fails add 'limit maxfiles 2048 2048' to /etc/launchd.conf"
ulimit -n 2048

echo "Note that this script requrires a global installation of deoptigate"
echo "Results are moved from the deoptigate target to ../results.deoptigate."
echo "Make sure to update the DEOPTIGATE_TARGET path to match your environment"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT=$DIR/..

FILE=$ROOT/data/ibm-request.soap.xml
ITER=500
CONCURRENCY=100
DEOPTIGATE_TARGET=/var/folders/_4/5zjy2s2j0hgfphyt7xy8c78r0000gn/T/deoptigate/

## Buffering
buffering_htmlparser() {
  deoptigate $ROOT/bin/exmala \
    -s false                  \
    -p htmlparser             \
    -f $FILE                  \
    -n $ITER                  \
    -c $CONCURRENCY           \
  &&                          \
  mv $DEOPTIGATE_TARGET $ROOT/results.deoptigate/buffering-htmlparser/
}

buffering_xml2js() {
  deoptigate $ROOT/bin/exmala \
    -s false                  \
    -p xml2js                 \
    -f $FILE                  \
    -n $ITER                  \
    -c $CONCURRENCY           \
  &&                          \
  mv $DEOPTIGATE_TARGET $ROOT/results.deoptigate/buffering-xml2js/
}

## Streaming
streaming_htmlparser() {
  deoptigate $ROOT/bin/exmala \
    -s true                   \
    -p htmlparser             \
    -f $FILE                  \
    -n $ITER                  \
    -c $CONCURRENCY           \
  &&                          \
  mv $DEOPTIGATE_TARGET $ROOT/results.deoptigate/streaming-htmlparser/
}

streaming_xml2js() {
  deoptigate $ROOT/bin/exmala \
    -s true                   \
    -p xml2js                 \
    -f $FILE                  \
    -n $ITER                  \
    -c $CONCURRENCY           \
  &&                          \
  mv $DEOPTIGATE_TARGET $ROOT/results.deoptigate/streaming-xml2js/
}

buffering_xml2js
