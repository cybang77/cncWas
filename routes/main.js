var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
const {Point} = require('@influxdata/influxdb-client');
const hnlib = require('../bin/js/hnLibrary');
const hnAuth = require("../bin/js/hnAuth");
const app = require('../app');

router.get('/work-drop', (req, res, next) => {
  res.status(200).send() // 200 code send 
  req.app.io.emit('loss', 'null');
  req.app.io.emit('anomalyDetection', '-');
  console.log('check')
});

router.get('/cycle-info', (req, res, next) => {
  if (req.headers.token == null) {
    res.status(401).send({"result":"Invalid access token","errormessage":"oauth.v2.TokenNotFound"})
  }
  else {
    const valiedToken = hnAuth.TokenCheck(req.headers.token);
    if (valiedToken.res) {
      res.status(valiedToken.code).send(valiedToken.message);
      let start = hnlib.timestampTodate(req.query.startTime)
      let end = hnlib.timestampTodate(req.query.endTime)
      influxWriteApi = req.app.influxdb.getWriteApi('HN', 'cycle_info', 'ns')
      point = new Point(req.query.opCode).stringField('startTime', start).stringField('endTime', end).intField('count', req.query.count).intField('cycleTime', req.query.cycleTime)//.stringField('S/N', SN)
      influxWriteApi.writePoint(point);
      influxWriteApi.close();
      req.app.totalCount += 1;
      req.app.todayCount += 1;
      req.app.io.emit('days', req.app.todayCount);
      req.app.io.emit('count', req.app.totalCount);

      // 1cycle이 끝났으니, 만약 model 교체 요청이 있으면 수행
      if (req.app.changeModel){
        req.app.changeModel = false;

      }
    } else {
      res.status(valiedToken.code).send(valiedToken.message);
    }
  }
});

router.get('/real-time-loss', (req, res, next) => {
  if (req.headers.token == null) {
    res.status(401).send({"result":"Invalid access token","errormessage":"oauth.v2.TokenNotFound"})
  } else {
    const valiedToken = hnAuth.TokenCheck(req.headers.token);
    if (valiedToken.res) {
      res.status(valiedToken.code).send(valiedToken.message);
      req.app.io.emit('realtimeLoss', req.query.loss);
      req.query.loss = parseFloat(req.query.loss);
      if (req.app.lossCount == 1) {
        req.app.io.emit('anomalyDetection', '판정중');
      }
      if (req.app.lossCount < 50) {
        req.app.lossSum += req.query.loss;
        req.app.lossCount++;
        req.app.lossCollection.push(req.query.loss);
      } else {
        if (req.app.lossSum/req.app.lossCount > 0.05) {
          req.app.io.emit('anomalyDetection', '비정상');
          req.app.io.emit('alert');
        } else {
          req.app.io.emit('anomalyDetection', '정상');
        }
        req.app.lossCount--;
        req.app.lossSum -= req.app.lossCollection[0];
        req.app.lossCollection.shift();
      }
    } else {
      res.status(valiedToken.code).send(valiedToken.message);
    }
  }
});

module.exports = router;