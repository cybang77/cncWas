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
app.use(cookieParser());
app.use(busboy())

app.use('/main', mainRouter);
app.use('/quality', predictRouter);

module.exports = app;