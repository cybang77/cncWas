var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
const {Point} = require('@influxdata/influxdb-client');
const hnlib = require('../bin/js/hnLibrary');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index.html');
});
router.get('/alert', (req, res, next) => {
  res.status(200).send() // 200 code send 
  req.app.io.emit('alert');
});
router.get('/work-drop', (req, res, next) => {
  res.status(200).send() // 200 code send 
  // req.app.io.emit('isWork', 'stop');
  req.app.io.emit('loss', 'null');
  req.app.io.emit('AD', '-');
  console.log('check')
});

router.get('/cycle-info', (req, res, next) => {
  res.status(200).send()
  let start = hnlib.timestampTodate(req.query.startTime)
  let end = hnlib.timestampTodate(req.query.endTime)
  influxWriteApi = req.app.influxdb.getWriteApi('HN', 'cycle_info', 'ns')
  point = new Point(req.query.opCode).stringField('startTime', start).stringField('endTime', end).intField('count', req.query.count).intField('cycleTime', req.query.cycleTime)
  influxWriteApi.writePoint(point);
  influxWriteApi.close();
  req.app.totalCount += 1;
  req.app.todayCount += 1;
  req.app.io.emit('days', req.app.todayCount);
  req.app.io.emit('count', req.app.totalCount);
  setTimeout(() => {
    req.app.io.emit('AD', '-');
    req.app.lossSum = 0;
    req.app.lossCount = 1;
    req.app.lossCollection = [];
  }, 3000)
});

router.get('/work-info', (req, res, next) => {
  res.status(200).send();
  // req.app.work = req.query.work;
  // req.app.io.emit('isWork', req.query.work);
});

router.get('/real-time-loss', (req, res, next) => {
  res.status(200).send();
  req.app.io.emit('loss', req.query.loss);
  req.query.loss = parseFloat(req.query.loss);

  if (req.app.lossCount == 1) {
    req.app.io.emit('AD', '판정중');
  }
  if (req.app.lossCount < 50) {
    req.app.lossSum += req.query.loss;
    req.app.lossCount++;
    req.app.lossCollection.push(req.query.loss);
  } else {
    if (req.app.lossSum/req.app.lossCount > 0.05) {
      req.app.io.emit('AD', '비정상');
      req.app.io.emit('alert');
    } else {
      req.app.io.emit('AD', '정상');
    }
    req.app.lossCount--;
    req.app.lossSum -= req.app.lossCollection[0];
    req.app.lossCollection.shift();
  }
});

module.exports = router;