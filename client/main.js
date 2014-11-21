'use strict';
/*jshint browser: true*/

var data = {
  buffering: {
    xml2js: {
        'c100-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c100-n2000_ibm-request.soap.xml.json')
      , 'c200-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c200-n2000_ibm-request.soap.xml.json')
      , 'c300-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c300-n2000_ibm-request.soap.xml.json')
      , 'c500-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c500-n2000_ibm-request.soap.xml.json')
      , 'c1000-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c1000-n2000_ibm-request.soap.xml.json')
      , 'c2000-n2000_ibm-request.soap': 
          require('../results/buffering-xml2js-c2000-n2000_ibm-request.soap.xml.json')
    },
    htmlparser: {
        'c100-n2000_ibm-request.soap': 
          require('../results/buffering-htmlparser-c100-n2000_ibm-request.soap.xml.json')
      , 'c200-n2000_ibm-request.soap': 
          require('../results/buffering-htmlparser-c200-n2000_ibm-request.soap.xml.json')
      , 'c300-n2000_ibm-request.soap': 
          require('../results/buffering-htmlparser-c300-n2000_ibm-request.soap.xml.json')
      , 'c500-n2000_ibm-request.soap': 
          require('../results/buffering-htmlparser-c500-n2000_ibm-request.soap.xml.json')
    }
  },
  streaming: {
    xml2js: {
        'c100-n2000_ibm-request.soap': 
          require('../results/streaming-xml2js-c100-n2000_ibm-request.soap.xml.json')
      , 'c200-n2000_ibm-request.soap': 
          require('../results/streaming-xml2js-c200-n2000_ibm-request.soap.xml.json')
    },
    htmlparser: {
        'c100-n2000_ibm-request.soap': 
          require('../results/streaming-htmlparser-c100-n2000_ibm-request.soap.xml.json')
      , 'c200-n2000_ibm-request.soap': 
          require('../results/streaming-htmlparser-c200-n2000_ibm-request.soap.xml.json')
    }
  }
}

var Flotr = window.Flotr;

function createDataset(result) {

  var xmin = getTime(0)
    , xmax = getTime(result.memories.length - 1);

  function getTime(memIndex) {
    var time = result.memories[memIndex].time;
    return (time[0] * 1E9 + time[1]);
  }

  function pointify(arr) {
    var ymax, ymin;

    var points = arr.map(function add_x_(y, idx) {
      if (!ymin) ymin = y; else ymin = Math.min(ymin, y);
      if (!ymax) ymax = y; else ymax = Math.max(ymax, y);
      var x = (getTime(idx) - xmin) / 1E9;

      return [ x, y ];
    })

    return { 
        points: points
      , xmin: 0 
      , xmax: (xmax - xmin) / 1E9
      , ymin: ymin
      , ymax: ymax 
    }
  }

  return {
      elapsed           : pointify(result.elapseds)
    , heapUsed          : pointify(result.heapUseds)
    , heapTotal         : pointify(result.heapTotals)
    , rss               : pointify(result.rsss)
    , options           : result.options
    , averageProcessing : result.averageProcessing
  }
}

function drawDataset(el, set) {

  function draw(data, graphEl, title, ylabel) {
    var opts = {
      xaxis: {
          min: Math.floor(data.xmin)
        , max: Math.floor(data.xmax) + 1
        , showLabels: true
        , title: 's'
      },
      yaxis: {
          min: Math.floor(data.ymin)
        , max: Math.floor(data.ymax) + 1
        , showLabels: true
        , title: ylabel
      },
      grid: {
          color: '#dddddd'
        , backgroundColor: '#ffffff'
      },
      title: title,
      resolution:1,
      titleAlign: 'center',


    }
    Flotr.draw(graphEl, data, opts)
  }

  var html = [
      '   <h5>'
    , '   ' + (set.options.streaming ? 'Streaming' : 'Buffering')
    , set.options.parser + ' | '
    , ' Concurrency: ' + set.options.concurrency
    , '  Number: ' + set.options.number 
    , '  Average Processing: '
    , Math.round(parseFloat(set.averageProcessing.slice(0, -2))) + 'ms'
    , '   </h5>'   
    , '   <table id="' + set.options.resultsFile + '">'
    , '     <tr>'
    , '      <td class="heapused-chart chart"></td>'
    , '      <td class="heaptotal-chart chart"></td>'
    , '     </tr>'
    , '     <tr>'
    , '      <td class="rss-chart chart"></td>'
    , '      <td class="elapsed-chart chart"></td>'
    , '     </tr>'
    , '   </table>'
  ].join('\n')

  var child = document.createElement('div')
  child.setAttribute('class', 'dataset')
  child.innerHTML = html;
  child = el.appendChild(child);

  var heapUsedEl = child.getElementsByClassName('heapused-chart')[0];
  draw(set.heapUsed, heapUsedEl, 'Heap Used', 'MB');

  var heapTotalEl = child.getElementsByClassName('heaptotal-chart')[0];
  draw(set.heapTotal, heapTotalEl, 'Heap Total', 'MB');

  var rssEl = child.getElementsByClassName('rss-chart')[0];
  draw(set.rss, rssEl, 'RSS', 'MB');

  var elapsedEl = child.getElementsByClassName('elapsed-chart')[0];
  draw(set.elapsed, elapsedEl, 'Time per Parse', 'ms');
}

var rootEl = document.getElementById('exmala-results');

var datasets = {
  buffering: {
    xml2js: {
        'c100-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c100-n2000_ibm-request.soap'])
      , 'c200-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c200-n2000_ibm-request.soap'])
      , 'c300-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c300-n2000_ibm-request.soap'])
      , 'c500-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c500-n2000_ibm-request.soap'])
      , 'c1000-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c1000-n2000_ibm-request.soap'])
      , 'c2000-n2000_ibm-request.soap': 
          createDataset(data.buffering.xml2js['c2000-n2000_ibm-request.soap'])
    },
    htmlparser: {
        'c100-n2000_ibm-request.soap': 
          createDataset(data.buffering.htmlparser['c100-n2000_ibm-request.soap'])
      , 'c200-n2000_ibm-request.soap': 
          createDataset(data.buffering.htmlparser['c200-n2000_ibm-request.soap'])
      , 'c300-n2000_ibm-request.soap': 
          createDataset(data.buffering.htmlparser['c300-n2000_ibm-request.soap'])
      , 'c500-n2000_ibm-request.soap': 
          createDataset(data.buffering.htmlparser['c500-n2000_ibm-request.soap'])
    }
  },
  streaming: {
    xml2js: {
        'c100-n2000_ibm-request.soap': 
          createDataset(data.streaming.xml2js['c100-n2000_ibm-request.soap'])
      , 'c200-n2000_ibm-request.soap': 
          createDataset(data.streaming.xml2js['c200-n2000_ibm-request.soap'])
    },
    htmlparser: {
        'c100-n2000_ibm-request.soap': 
          createDataset(data.streaming.htmlparser['c100-n2000_ibm-request.soap'])
      , 'c200-n2000_ibm-request.soap': 
          createDataset(data.streaming.htmlparser['c200-n2000_ibm-request.soap'])
    }
  }
}

function heading(s) {
  var el = document.createElement('div');
  el.setAttribute('class', 'dataset-group')
  el.innerHTML = '<h3>' + s + '</h3>';
  rootEl.appendChild(el);
  return el;
}

var el = heading('Buffering xml2js')

drawDataset(el, datasets.buffering.xml2js['c100-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.xml2js['c200-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.xml2js['c300-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.xml2js['c500-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.xml2js['c1000-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.xml2js['c2000-n2000_ibm-request.soap']);

el = heading('Streaming xml2js')

drawDataset(el, datasets.streaming.xml2js['c100-n2000_ibm-request.soap']);
drawDataset(el, datasets.streaming.xml2js['c200-n2000_ibm-request.soap']);

el = heading('Buffering htmlparser')

drawDataset(el, datasets.buffering.htmlparser['c100-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.htmlparser['c200-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.htmlparser['c300-n2000_ibm-request.soap']);
drawDataset(el, datasets.buffering.htmlparser['c500-n2000_ibm-request.soap']);

el = heading('Streaming htmlparser')

drawDataset(el, datasets.streaming.htmlparser['c100-n2000_ibm-request.soap']);
drawDataset(el, datasets.streaming.htmlparser['c200-n2000_ibm-request.soap']);
