#!/usr/bin/env bash

echo "If ulimit fails add 'limit maxfiles 2048 2048' to /etc/launchd.conf"
ulimit -n 2048

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT=$DIR/..

STREAMING=true
PARSER=xml2js
FILE=$ROOT/data/ibm-request.soap.xml

time $ROOT/bin/exmala -s $STREAMING \
  -p $PARSER                        \
  -f $FILE                          \
  -n 2000                           \
  -c 10                             \
&&                                  \
time $ROOT/bin/exmala -s $STREAMING \
  -p $PARSER                        \
  -f $FILE                          \
  -n 2000                           \
  -c 20                             \
&&                                  \
time $ROOT/bin/exmala -s $STREAMING \
  -p $PARSER                        \
  -f $FILE                          \
  -n 2000                           \
  -c 30                             \
&&                                  \
time $ROOT/bin/exmala -s $STREAMING \
  -p $PARSER                        \
  -f $FILE                          \
  -n 2000                           \
  -c 50                             
