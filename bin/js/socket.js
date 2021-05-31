const app = require('../../app.js');
var server = require('../www.js');
var io = require('socket.io')(server, {
  cors: {
    origin: "http://9.8.100.153:1234",
    methods: ["GET", "POST"]
  },
  serveClient: true,
  transports: ['websocket', 'polling']
});
  
io.on('connection', (socket) => {
  console.log('socket connected');
});

module.exports = io;