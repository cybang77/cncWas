#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('cnc-was:server');
var http = require('http');
app.hnlib = require('./js/hnLibrary')

// create http server
var server = http.createServer(app);
server.listen(8082);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  process.exit(1);
});

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function optionClone(obj) {
  var output = {};
  for (let i in obj) {
    output[i] = obj[i];
  }
  return output;
}


module.exports = server;