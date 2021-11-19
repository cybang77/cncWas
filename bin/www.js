#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('cnc-was:server');
var http = require('http');
app.buf.hnlib = require('./js/hnLibrary')

// create http server
var server = http.createServer(app);

// 포트 설정
server.listen(8082);
server.on('error', onError);
server.on('listening', onListening);

// 소켓 생성 및 이벤트 정의
socket = require('./socket.js');
socket.create(server);
require('../routes/socket');

// kafka consumer run
kafkaClient = require('./kafkaClient');
kafkaClient.run().catch(console.error);

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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

//강제 종료시 메시지
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  process.exit(1);
});



module.exports = server;