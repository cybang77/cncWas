var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
// const app = require('../app');
const hnlib = require('../bin/js/hnLibrary');
const hnAuth = require("../bin/js/hnAuth");
const monent = require('moment');

router.get('/device-health-check', (req, res, next) => {
  req.app.influxdb.query(`SELECT "LoadSpindle" FROM "MH001001001-CNC001"."autogen"."`+ req.query.opcode +`" where time > now() - 10s`).then(result => {
    // 장비가 작동 중일 때
    if (result.length > 0) {
      res.status(200).send({"status": "success"})
      // 장비가 중지 되어있을 때
    } else {
      res.status(409).send({"status": "failure"})
    }
  }).catch(err => {
    console.error("[DeviceHealthCheck] check your code or query.");
  });
});

// 생산량 일, 주, 월, 정해진 기간별 return
// ex)) ?classification=day&startDate=2021-10-25T00:00:00Z&endDate=2021-11-01T00:00:00Z
router.get('/product-counts', (req, res, next) => {
  let date = [];
  let counts = [];
  let returnData = "";
  const startDate = new Date(req.query.startDate).getTime()*1000000;
  const endDate = new Date(req.query.endDate).getTime()*1000000;
  req.app.influxdb.query(`SELECT count("cycleTime") AS "count_cycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info" where time > `+ startDate + ` AND time < `+ endDate +` GROUP BY time(1d)` ).then(result => {
    for(let i = 0; i < result.length; i++) {
      date.push(result[i]["time"]["_nanoISO"]);
      counts.push(result[i]["count_cycleTime"]);
    }

    let sum =0;
    switch (req.query.classification) {
      case "day":
        for(i=0; i < counts.length; i++) {
          returnData += '{"date": '+ date[i] +', "count": ' + counts[i]+ '}\n';
        }
        res.status(200).send(returnData);
        break;
      case "week":
        let w = monent(date[0], "YYYY-MM-DD").isoWeek();
        for(i=0; i < counts.length; i++) {
          if (w == monent(date[i], "YYYY-MM-DD").isoWeek()) {
            sum += counts[i];
          } else {
            // console.log()
            returnData += '{"date": '+ monent(date[i-1][0]+date[i-1][1]+date[i-1][2]+date[i-1][3]+w, 'YYYYWW').format('YYYY-MM-DD')+'T00:00:00Z' +', "count": ' + sum+ '}\n';
            sum = counts[i];
            w = monent(date[i], "YYYY-MM-DD").isoWeek();
          }
        }
        returnData += '{"date": '+ monent(date[date.length-1][0]+date[date.length-1][1]+date[date.length-1][2]+date[date.length-1][3]+w, 'YYYYWW').format('YYYY-MM-DD')+'T00:00:00Z' +', "count": ' + sum+ '}\n';
        res.status(200).send(returnData);
        break;
      case "month":
        let mon = monent(date[0], "YYYY-MM-DD").format('MM');
        sum = 0;
        for(i=0; i < counts.length; i++) {
          if (mon == monent(date[i], "YYYY-MM-DD").format('MM')) {
            sum += counts[i];
          } else {
            // console.log()
            returnData += '{"date": '+ date[i-1][0]+date[i-1][1]+date[i-1][2]+date[i-1][3]+'-'+date[i-1][5]+date[i-1][6]+'-01T00:00:00Z' +', "count": ' + sum+ '}\n';
            sum = counts[i];
            mon = monent(date[i], "YYYY-MM-DD").format('MM');
          }
        }
        returnData += '{"date": '+ date[date.length-1][0]+date[date.length-1][1]+date[date.length-1][2]+date[date.length-1][3]+'-'+date[date.length-1][5]+date[date.length-1][6]+'-01T00:00:00Z' +', "count": ' + sum+ '}\n';
        res.status(200).send(returnData);
        break;
      default:
        res.status(400).send({"status": "check your params"});
        console.error("[ProductCounts] check your params");
        break;
    }
  }).catch(err => {
    res.status(400).send({"status": "check your params"});
    console.error("[ProductCounts] check your code or query.");
  });
});

// 질문! timout 세팅 -> 날짜가 길어질 수록 가져오는 속도도 느리고, 결국 못가져옴. 버그도 존재
router.get('/custom-history', (req, res, next) => {
  const startDate = new Date(req.query.startDate).getTime()*1000000;
  const endDate = new Date(req.query.endDate).getTime()*1000000;
  req.app.influxdb.query(`SELECT mean("LoadSpindle") AS "mean_LoadSpindle", mean("Mae") AS "mean_Mae", mean("Predict") AS "mean_Predict" FROM "MH001001001-CNC002-predict"."autogen"."OP10-3" where time > `+ startDate + ` AND time < `+ endDate ).then(result => {
    console.log(result);
    res.status(200).send({"status": "check your params"});
  }).catch(err => {
    console.log(err.indexOf("query-timeout"))
    console.error("[CustomHistory] check your code or query.");
  });
});

router.get('/cycle-time-list', (req, res, next) => {
  let returnData = "";
  req.app.influxdb.query(`SELECT "transCycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info" ORDER BY time DESC LIMIT 100`).then(result => {
    for (let i=0; i< result.length; i++) {
      returnData += '{"date": '+ result[i]["time"]["_nanoISO"] +', "cycle time": ' + result[i]["transCycleTime"]+ '}\n';
    }
    res.status(200).send(returnData);
  }).catch(err => {
    console.error("[CycleTimeList] check your code or query.");
  });
});

module.exports = router;