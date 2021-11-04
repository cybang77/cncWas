var server = require('./www')
require('./kafka')
var app = require('../app')
var io = require('socket.io');
var monent = require('moment');

const config = require( './config/config.js')
const Influx = require('influx');
const influx = new Influx.InfluxDB(config.influxdb)
app.influxdb = influx

app.lossSum = 0;
app.lossCount = 1;
app.lossCollection = [];
app.work = 'stop'

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
  
  // connection시 인증 params
  app.io.on('connection', (socket) => {
    console.log("connected!!!!!!!!!", socket.id)

    // 현재까지 생산된 제품의 총 갯수
    socket.on('setCount', () => {
      influx.query(`SELECT count("cycleTime") AS "count_cycleTime" FROM "cycle_info"`).then(result => {
        app.totalCount = parseInt(result[0]["count_cycleTime"]);
        socket.emit('count', app.totalCount);
      }).catch(err => {
        socket.emit('count', 'internal error');
        console.error("[setCount] check your code or query.");
      });
    });
    
    // 현재 까지 생산된 제품의 평균 CT
    socket.on('setMeanCycleTime', () => {
      influx.query(`SELECT mean("cycleTime") AS "mean_cycleTime" FROM "cycle_info" where time > now()-20m`).then(result => {
        const mean = app.hnlib.timestampTotime(result[0]["mean_cycleTime"])
        socket.emit('cycleTimeMean', mean);
      }).catch(err => {
        socket.emit('cycleTimeMean', 'internal error');
        console.error("[setMeanCycleTime] check your code or query.");
      });
    });
  
    // 일, 주, 월 별 생산 된 제품 갯수를 보냄
    // group by time(1M), group by time(1w)의 경우 flux만 지원되어서 InfluxQL을 사용해야하는 현재는 직접 연산.
    socket.on('setCountsHistory', () => {
      let day = ""
      let week = ""
      let weeks = new Array(53).fill(0);
      let endWeek = 0;
      influx.query(`SELECT count("cycleTime") AS "count_a_day_cycleTime" FROM "cycle_info" GROUP BY time(1d)`).then(result => {
        const startWeek = monent(result[0]["time"]["_nanoISO"].split("T")[0], "YYYY-MM-DD").isoWeek();
        endWeek = startWeek;
        week = week + result[0]["time"]["_nanoISO"].split("T")[0] + ","; 
        for(let i=0; i< result.length; i++){
          const date = result[i]["time"]["_nanoISO"].split("T")[0];
          const count = result[i]["count_a_day_cycleTime"];
          const w = monent(date, "YYYY-MM-DD").isoWeek()
          day = day + date +"," +count+"\n";
          weeks[w] = weeks[w] + parseInt(count);
          if (w != endWeek) {
            week = week + weeks[endWeek]+"\n" + date + ",";
          }
          endWeek = w;
        }
        week = week + weeks[endWeek];

        day = day.slice(0, -1);
        socket.emit('days', day);
        socket.emit('weeks', week);

      }).catch(err => {
        socket.emit('days', 'internal error');
        console.error("[setCount1Day] check your code or query.");
      });
    });

    // 최근 100개의 사이클 리스트 보냄
    socket.on('setCycleTimeList', () => {
      let ctList = "";
      influx.query(`SELECT "cycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info" ORDER BY DESC limit 100`).then(result => {
        for(let i=0; i< result.length; i++){
          ctList = ctList + result[i]["time"]["_nanoISO"].replace("T", " ").split(".")[0] + "," + result[i]["cycleTime"] + "\n";
        }
        ctList = ctList.slice(0, -1);
        console.log(ctList)
        socket.emit('ctChart', ctList);
      }).catch(err => {
        socket.emit('ctChart', 'internal error');
        console.error("[setCycleTimeList] check your code or query.");
      });
    });

    // ================================================================ 협 의 중 ================================================================
    socket.on('currentModelInfo', () => {
      // console.log("예지")
      // socket.emit('nowModelInfo', {model: 'prediction_bi', processCnt: 4});
      let option = optionClone(config.modelChange)
      option.path = option.path + 'info'
      http.get(option, function (res) {
        res.on("data", function (chunk) {
          chunk = chunk.toString('utf8');
          if (chunk.length > 10) {
            chunk = JSON.parse(chunk);
            // chunk[0].name = chunk[0].name.split('_')[1]
            socket.emit('nowModelInfo', { model: chunk[0].name, processCnt: chunk.length });
            // console.log('nowModelInfo', { model: chunk[0].name, processCnt: chunk.length })
          } else {
            console.log("stop 상태")
          }
        });
      }).on('error', function (e) {
        socket.emit('nowModelInfo', { model: '', processCnt: 0 });
        console.log("Got error: " + e.message);
      });
    });
  
    socket.on('modelStop', (model) => {
      let option = optionClone(config.modelChange)
      // option.path = option.path + model
      option.path = option.path + 'stop'
  
      http.get(option, function (res) {
        if (res.statusCode == 200) {
          res.on("data", function (chunk) {
            chunk = chunk.toString('utf8');
            chunk = JSON.parse(chunk);
            console.log('stop status ', res.statusCode, ' stop body ', chunk)
            if (chunk.State == 'Prediction Stop') {
              socket.emit('modelChangRes', { state: 'Engine Stop Sucess' });
            } else {
              socket.emit('modelChangRes', { state: 'Engine Stop Fail' });
            }
          });
        }
      }).on('error', function (e) {
        console.log("Got error: " + e.message);
      });
    });
  
    socket.on('modelStart', (model) => {
      let option = optionClone(config.modelChange)
      // option.path = option.path + model
      model = model.split('_')[1]
      option.path = option.path + model
      console.log(option.path, "  sss")
      http.get(option, function (res) {
        if (res.statusCode == 200) {
          res.on("data", function (chunk) {
            chunk = chunk.toString('utf8');
            chunk = JSON.parse(chunk);
            console.log('start status ', res.statusCode, ' start body ', chunk)
            if (chunk.State == 'Prediction Stop') {
              socket.emit('modelChangRes', { state: 'Engine Start Sucess' });
            } else {
              socket.emit('modelChangRes', { state: 'Engine Start Fail' });
            }
          });
        }
      }).on('error', function (e) {
        console.log("Got error: " + e.message);
      });
    });
  
    socket.on('recentlyPredictInfo', () => {
      if (app.predictInfo == undefined) {
        fs.readFile('/home/rnd03/workspace/source/WAS/sprint1/public/predictImg/predictInfo.txt', 'utf-8', (err, data) => {
          if(err) {
            if (err.errno != -21) 
              console.log('wwww 261', err)
          } else {
            app.predicInfo = JSON.parse(data)
            socket.emit('qualityPredictEnd', app.predicInfo)
          }
        })
      } else {
        socket.emit('qualityPredictEnd', app.predicInfo)
      }
    });
    // ================================================================================================================================

    // scichart에 실시간으로 카프카에서 받은 데이터 보냄.
    socket.on('streamPredict', () => {
      // console.log('streamPredict')
      socket.interval = setInterval(() => {
        let res = ""
        let end = app.predictList.length
  
        app.predictList.sort(function(a,b) {
          return a[1] - b[1];
        })
  
        // 1000개 이상 데이터 가지고 있으면~ 최대 1000개 묶어서 보냄
        if(app.predictList.length > 1000) {
          for(let i=0; i< 1000; i++){
            res += app.predictList.shift().join(",")+"\n"
          }
          socket.emit('returnStreamPredict', res)  
        }
        // 1000개 이하 데이터는 전부 한번에 묶어서 보냄
        else if(app.predictList.length > 0) {
          for(let i=0; i< end; i++){
            res += app.predictList.shift().join(",")+"\n"
          }
          socket.emit('returnStreamPredict', res)  
        }
      }, 1000)
    });

    // 연결 끊김
    socket.on("disconnect", () => {
      if (socket.interval != undefined){
        clearInterval(socket.interval);
      }
      socket.disconnect();
    });

    // 연결시 에러
    socket.on("error", () => {
      if (socket.interval != undefined){
        clearInterval(socket.interval);
      }
      socket.disconnect();
    });
  });