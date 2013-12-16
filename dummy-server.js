#!/usr/bin/env node
var util = require('util');
var os   = require('os');
var http = require('http');
var redis = require('redis').createClient();
var count = 0;

var bulkhead = [
  "  _   _           _        _      ",
  " | \\ | |         | |      (_)     ",
  " |  \\| | ___   __| | ___   _ ___  ",
  " | . ` |/ _ \\ / _` |/ _ \\ | / __| ",
  " | |\\  | (_) | (_| |  __/_| \\__ \\ ",
  " \\_| \\_/\\___/ \\__,_|\\___(_) |___/ ",
  "                         _/ |     ",
  "                        |__/      "
];

http.createServer(function (req, res) {
  console.log( 'incoming %d', count );
  count++;
  res.writeHead(200, {'Content-Type': 'text/plain'});

  //Linux blue 3.12.5-gentoo #1 SMP Fri Dec 13 11:31:33 EST 2013 x86_64 AMD Phenom(tm) II X6 1090T Processor AuthenticAMD GNU/Linux

  var uname = util.format( '%s %s %s %s %s %s', 
  	os.type(),
  	os.hostname(), 
  	process.version,
  	new Date(),
  	process.arch,
  	os.cpus()[0].model );

  redis.smembers( 'route::'+req.headers['x-token'], function(err,vals){
    var out = [
    	'Hello World',
    	'Path->'+req.url,
      'NodeJS ' + process.version,
      uname,
      'peer group->' + vals.join(','),
      'headers->'
    ];
    Object.keys(req.headers).sort().forEach( function( it ) {
      out.push(it+': '+req.headers[it]);
    });
    res.end([].concat( bulkhead, out ).join('\n'));
  });
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');

