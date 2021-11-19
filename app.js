var express = require('express');
const spindleloadRouter = require('./routes/spindleload');
const qualityRouter = require('./routes/quality');
const busboy = require('connect-busboy');
const config = require( './bin/config/config.js')
const Influx = require('influx');
const influx = new Influx.InfluxDB(config.influxdb);

var app = express();
app.use(express.json());
app.use(busboy())

app.use('/spindleload', spindleloadRouter);
app.use('/quality', qualityRouter);

// 전역 변수를 사용하기 위한 버퍼 프로퍼티 선언
app.buf = new Object();
app.influxdb = influx;

module.exports = app;