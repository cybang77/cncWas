var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
const {Point} = require('@influxdata/influxdb-client');
const hnlib = require('../bin/js/hnLibrary');
const hnAuth = require("../bin/js/hnAuth");
const app = require('../app');

// /* GET home page. */
// router.get('/', (req, res) => {
//   res.render('index.html');
// });

router.get('/work-drop', (req, res, next) => {
  res.status(200).send() // 200 code send 
  // req.app.io.emit('isWork', 'stop');
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
    // console.log("wwww 27 ", valiedToken)
    if (valiedToken.res) {
      res.status(valiedToken.code).send(valiedToken.message);
      let start = hnlib.timestampTodate(req.query.startTime)
      let end = hnlib.timestampTodate(req.query.endTime)
      influxWriteApi = req.app.influxdb.getWriteApi('HN', 'cycle_info', 'ns')
      // let SN = '103'+String(parseInt(req.query.startTime))+String(parseInt(req.query.cycleTime))
      point = new Point(req.query.opCode).stringField('startTime', start).stringField('endTime', end).intField('count', req.query.count).intField('cycleTime', req.query.cycleTime)//.stringField('S/N', SN)
      // console.log(SN)
      influxWriteApi.writePoint(point);
      influxWriteApi.close();
      req.app.totalCount += 1;
      req.app.todayCount += 1;
      // req.app.io.emit('productSerialNum', SN)
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
  // console.log(req.query.loss)
  if (req.headers.token == null) {
    // console.log("wwww 55 ", 'Invalid access token","errormessage":"oauth.v2.TokenNotFound')
    res.status(401).send({"result":"Invalid access token","errormessage":"oauth.v2.TokenNotFound"})
  } else {
    const valiedToken = hnAuth.TokenCheck(req.headers.token);
    // console.log("wwww 63 ", valiedToken)
    if (valiedToken.res) {
      res.status(valiedToken.code).send(valiedToken.message);
      // console.log(req.query.loss)
      req.app.io.emit('realtimeLoss', req.query.loss);
      req.query.loss = parseFloat(req.query.loss);
      // req.app.io.emit('lossData10Mean', req.query.loss);
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

router.get('/test', (req, res) => {
  // console.log(req.app.keycloak)
  if (req.headers.token == null) {
    res.status(401).send({"result":"Invalid access token","errormessage":"oauth.v2.TokenNotFound"})
  }
  else {
    const valiedToken = hnAuth.TokenCheck(req.headers.token);

    if (valiedToken.res) {
      res.status(valiedToken.code).send(valiedToken.message);
  } else {
      res.status(valiedToken.code).send(valiedToken.message);
    }
  }
});

router.get('/detection', (req, res) => {
  console.log(req.query.info);
  // app.io.emit('lossData10Mean', message.value.split(',')[5]);
});

router.post('/img', (req, res, next) => {
  res.send("OK");
});

module.exports = router;