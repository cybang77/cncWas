var createError = require('http-errors');
var express = require('express');
var path = require('path');
var history = require('express-history-api-fallback');
var indexRouter = require('./routes/index');
const root = `${__dirname}/public`

var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(history('index.html', { root }));

module.exports = app;