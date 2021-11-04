var server = require('./www')
require('./kafka')
var app = require('../app')
var io = require('socket.io');
var monent = require('moment');

// const { InfluxDB } = require('@influxdata/influxdb-client');
const config = require( './config/config.js')
// const influx = new InfluxDB(config.influxdb)
const Influx = require('influx');
const influx = new Influx.InfluxDB(config.influxdb)

app.lossSum = 0;
app.lossCount = 1;
app.lossCollection = [];
app.work = 'stop'

// var server = https.createServer(credentials, app);
app.influxdb = influx
// app.influxQuery = app.influxdb.getQueryApi('HN')

app.io = io(server, {
    // cors: { origin: "*" }
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
    socket.on('setCount', () => {
      influx.query(`SELECT count("cycleTime") AS "count_cycleTime" FROM "cycle_info"`).then(result => {
        app.totalCount = parseInt(result[0]["count_cycleTime"]);
        socket.emit('count', app.totalCount);
      }).catch(err => {
        socket.emit('count', 'internal error');
        console.error("[setCount] check your code or query.");
      });
      // app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start:0)|> filter(fn: (r) => r["_measurement"] == "OP10-3")|> filter(fn: (r) => r["_field"] == "count") |> count(column: "_value")`, {
      //   app.influxQuery.queryRows(`SELECT count("cycleTime") AS "count_cycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info"`, {
      //   next(row, tableMeta) {
      //     const o = tableMeta.toObject(row)
      //     console.log(o)
      //     app.totalCount = o._value
      //     // socket.emit('count', app.totalCount)
      //     console.log("aaa ",totalCount)
      //   }, error(error) {
      //     console.error(error)
      //   }, complete() {
      //   },
      // })
    });
    socket.on('setMeanCycleTime', () => {
      influx.query(`SELECT mean("cycleTime") AS "mean_cycleTime" FROM "cycle_info"`).then(result => {
        const mean = app.hnlib.timestampTotime(result[0]["mean_cycleTime"])
        socket.emit('cycleTimeMean', mean);
      }).catch(err => {
        socket.emit('cycleTimeMean', 'internal error');
        console.error("[setMeanCycleTime] check your code or query.");
      });
      // app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> filter(fn: (r) => r["_measurement"] == "OP10-3")
      //     |> filter(fn: (r) => r["_field"] == "cycleTime")   |> movingAverage(n: 5) |> last()`, {
      //   next(row, tableMeta) {
      //     const o = tableMeta.toObject(row)
      //     socket.emit('cycleTimeMean', o._value)
      //   }, error(error) {
      //     console.error(error)
      //   }, complete() {
      //     console.log('set mean process time')
      //   },
      // });
    });
  
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
        // socket.emit('months', month);gudt

        console.log(day)
        console.log("=========================================================")
        console.log(week)
        // socket.emit('days', mean);
      }).catch(err => {
        socket.emit('days', 'internal error');
        console.error("[setCount1Day] check your code or query.");
      });
      // let day = []
      // let cnt = 0
      // let week = []
      // let weeknumber;
      // let startweek;
      // app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> timeShift(duration: 9h, columns: ["_time"]) |> filter(fn: (r) => r["_measurement"] == "OP10-3") 
      //                         |> filter(fn: (r) => r["_field"] == "count") |> aggregateWindow(every: 1d, fn: count, createEmpty: false)`, {
      //   next(row, tableMeta) {
      //     const o = tableMeta.toObject(row)
      //     t = o._time.split('T')[0]
      //     day[cnt] = { date: t, count: o._value }
      //     cnt++;
      //     app.todayCount = o._value
      //   }, error(error) {
      //     console.error(error)
      //   }, complete() {
      //     for (let i = 0; i < day.length - 1; i++) {
      //       day[i].date = app.hnlib.InfluxAggregationTimeBug(day[i].date);
      //     }
      //     socket.emit('days', day)
  
      //     if (typeof (day) != "undefined") {
      //       for (let i = 0; i < day.length; i++) {
      //         if (typeof (day[i]) != 'undefined') {
      //           weeknumber = moment(day[i].date, "YYYY-MM-DD").isoWeek();
      //           lastweek = moment(day[day.length - 1].date, "YYYY-MM-DD").isoWeek();
      //           if (i == 0) {
      //             startweek = weeknumber;
      //             for (let j = 0; j < lastweek - startweek + 1; j++) {
      //               week[j] = { date: moment('2021'+(startweek+j), 'YYYYWW').format('YYYY-MM-DD'), count: 0 };
      //               // console.log(day[i].date)
      //             }
      //           }
      //           // week[weeknumber - startweek].date = day[i].date
      //           week[weeknumber - startweek].count = day[i].count + week[weeknumber - startweek].count;
      //         }
      //       }
      //     }
      //     socket.emit('weeklys', week)
      //   },
      // });
    });
    socket.on('setCount1Month', () => {
      var mon = []
      cnt = 0;
      // app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> timeShift(duration: 9h, columns: ["_time"]) |> filter(fn: (r) => r["_measurement"] == "OP10-3") 
      //                         |> filter(fn: (r) => r["_field"] == "count") |> aggregateWindow(every: 1mo, fn: count, createEmpty: false)`, {
      //   next(row, tableMeta) {
      //     const o = tableMeta.toObject(row)
      //     t = o._time.split('T')[0]
      //     mon[cnt] = { date: t, count: o._value }
      //     cnt++;
      //   }, error(error) {
      //     console.error(error)
      //   }, complete() {
      //     for (let i = 0; i < mon.length; i++) {
      //       if (typeof (mon[i]) == 'undefined') {
      //         mon = mon.slice(i + 1, mon.length)
      //       }
      //     }
      //     socket.emit('monthlys', mon);
      //   },
      // });
    });
    socket.on('setCycleTimeList', () => {
      // let result_s = []
      // let result_e = []
      // let result_t = []
      // count1 = 0
      // count2 = 0
      // count3 = 0
      // let history = [];
      // let lineHistory = [[], []]
      // app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: -4d) |> filter(fn: (r) => r["_measurement"] == "OP10-3") |> tail(n: 100)`, {
      //   next(row, tableMeta) {
      //     const o = tableMeta.toObject(row)
      //     if (o._field == 'startTime') {
      //       result_s[count1] = o._value;
      //       count1++;
      //     }
      //     if (o._field == 'endTime') {
      //       result_e[count2] = o._value;
      //       count2++;
      //     }
      //     if (o._field == 'cycleTime') {
      //       result_t[count3] = o._value / 1000;
      //       count3++;
      //     }
      //   }, error(error) {
      //     console.error(error)
      //   }, complete() {
      //     let i = 0
      //     for (i; i < result_s.length; i++) {
      //       if (typeof (result_s[i]) != 'undefined') {
      //         lineHistory[0][i] = result_e[i]
      //         lineHistory[1][i] = result_t[i];
      //         history[i] = { start: result_s[i], end: result_e[i], ct: app.hnlib.timestampTotime(result_t[i]) }
      //       }
      //     }
      //     if (i == result_s.length) {
      //       socket.emit('ctHistory', history)
      //       lineHistory[0] = lineHistory[0].slice(lineHistory[0].length - 10, lineHistory[0].length)
      //       lineHistory[1] = lineHistory[1].slice(lineHistory[1].length - 10, lineHistory[1].length)
      //       socket.emit('ctChart', lineHistory);
      //     }
      //   },
      // });
    });
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
  
    // socket.on('streamRaw', () => {
    //   // console.log('streamRaw')
    //   setInterval(() => {
    //     if(rawList.length > 0) {
    //       // 전송
    //       console.log("raw")
    //       socket.emit('returnStreamRaw', rawList.shift().join(","))  
    //     }
    //   }, 10)
    // });
  
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
  
    socket.on("disconnect", () => {
      if (socket.interval != undefined){
        clearInterval(socket.interval);
      }
      socket.disconnect();
    });
  
    socket.on("error", () => {
      if (socket.interval != undefined){
        clearInterval(socket.interval);
      }
      socket.disconnect();
    });
  });