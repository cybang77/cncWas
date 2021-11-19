// var server = require('./www')
// require('./kafka')
var app = require('../app')
var io = require('socket.io');

exports.create = function (server) {
  app.io = io(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    serveClient: true,
    transports: ['polling','websocket']
  });
  app.io.sockets.setMaxListeners(0);
  
  app.io.use((socket, next) => {
    next();
    // if (socket.handshake.query.token === "V4") {
    //     next();
    // } else {
    //     next(new Error("Authentication error"));
    // }
  })
  app.io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}