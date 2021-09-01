var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mainRouter = require('./routes/main');
const predictRouter = require('./routes/predict');
const root = `${__dirname}/public`;
const cookieParser = require('cookie-parser');
var history = require('express-history-api-fallback');
const busboy = require('connect-busboy');

var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(busboy())

app.use('/main', mainRouter);
app.use('/quality', predictRouter);


// var Keycloak = require('keycloak-connect');
// var session = require('express-session');

// var memoryStore = new session.MemoryStore();
// app.keycloak = new Keycloak({ store: memoryStore });

// //session
// app.use(session({
//   secret:'thisShouldBeLongAndSecret',
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore
// }));

// app.use(app.keycloak.middleware());

app.use(history('index.html', { root }));

module.exports = app;