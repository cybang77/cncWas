#!/usr/bin/env node
var app = require('../app');
var kafka = require('kafka-node');
var debug = require('debug')('cnc-was:server');
var http = require('http');
// var https = require('https')
var fs = require('fs')
var privateKey = fs.readFileSync('/home/rnd03/ssl/server.key', 'utf8');
var certificate = fs.readFileSync('/home/rnd03/ssl/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var io = require('socket.io');
var moment = require('moment');
const { InfluxDB, currentTime } = require('@influxdata/influxdb-client');
const { time } = require('console');
app.hnlib = require('../bin/js/hnLibrary')
const influx = new InfluxDB({
  url: "http://9.8.100.156:8086",
  token: "uOpIW55Map8EuwijejVYQkSlwtq1J_C8etbJxrRyOdl7jjS8cVRRKLnjJHmDSKs-urArRwqZYKlJqa3cxNZsNg=="
})
const options = {
  hostname: '9.8.100.151',
  port: 8080,
  path: '/process/prediction/',
  method: 'GET'
}
var consumer = new kafka.ConsumerGroup({ kafkaHost: '9.8.100.152:9092', autoCommit: true, fromOffset: 'latest', outOfRangeOffset: 'earliest', groupId: 'cncWas' }, 'MH001001001-CNC001');
// var consumerPredict = new kafka.ConsumerGroup({ kafkaHost: '9.8.100.152:9092', autoCommit: true, fromOffset: 'latest', outOfRangeOffset: 'earliest' }, 'MH001001001-CNC001-detection');
// var consumer2 = new kafka.ConsumerGroup({ kafkaHost: '9.8.100.152:9092', autoCommit: true, fromOffset: 'latest', outOfRangeOffset: 'earliest', groupId: 'cncWas' }, 'MH001001001-CNC001-detection');
const hnAuth = require("./js/hnAuth");
app.lossSum = 0;
app.lossCount = 1;
app.lossCollection = [];
app.work = 'stop'

// create http server
var server = http.createServer(app);
// var server = https.createServer(credentials, app);
app.influxdb = influx
app.influxQuery = app.influxdb.getQueryApi('HN')

app.io = io(server, {
  serveClient: true,
  transports: ['websocket']
});
app.io.sockets.setMaxListeners(0);

// connection시 인증 params
app.io.on('connection', (socket) => {
  // console.log(socket)
  // console.log('socket connected');
  socket.on('setCount', () => {
    app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start:0)|> filter(fn: (r) => r["_measurement"] == "OP10-3")|> filter(fn: (r) => r["_field"] == "count") |> count(column: "_value")`, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        app.totalCount = o._value
        app.io.emit('count', app.totalCount)
      }, error(error) {
        console.error(error)
      }, complete() {
      },
    })
  });
  app.io.on('setWork', () => {
    console.log('yeji')
    let health
    app.influxQuery.queryRows(`from(bucket: "cnc") |> range(start: -3s) |> filter(fn: (r) => r["_measurement"] == "OP10-3")`, {
      next(row, tableMeta) {
        health = tableMeta.toObject(row)
      }, error(error) {
        console.error(error)
      }, complete() {
        if (typeof (health) == 'undefined') {
          app.io.emit('isWork', 'stop');
        } else {
          app.io.emit('isWork', 'start');
        }
      },
    });
  });
  socket.on('setMeanCycleTime', () => {
    app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> filter(fn: (r) => r["_measurement"] == "OP10-3")
        |> filter(fn: (r) => r["_field"] == "cycleTime")   |> movingAverage(n: 5) |> last()`, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        app.io.emit('cycleTimeMean', o._value)
      }, error(error) {
        console.error(error)
      }, complete() {
        console.log('set mean process time')
      },
    });
  });

  app.io.on('setCount1Day', () => {
    let day = []
    let cnt = 0
    let week = []
    let weeknumber;
    let startweek;
    app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> timeShift(duration: 9h, columns: ["_time"]) |> filter(fn: (r) => r["_measurement"] == "OP10-3") 
                            |> filter(fn: (r) => r["_field"] == "count") |> aggregateWindow(every: 1d, fn: count, createEmpty: false)`, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        t = o._time.split('T')[0]
        day[cnt] = { date: t, count: o._value }
        cnt++;
        app.todayCount = o._value
      }, error(error) {
        console.error(error)
      }, complete() {
        for (let i = 0; i < day.length - 1; i++) {
          day[i].date = hnlib.InfluxAggregationTimeBug(day[i].date);
        }
        app.io.emit('days', day)

        if (typeof (day) != "undefined") {
          for (let i = 0; i < day.length; i++) {
            if (typeof (day[i]) != 'undefined') {
              weeknumber = moment(day[i].date, "YYYY-MM-DD").isoWeek();
              lastweek = moment(day[day.length - 1].date, "YYYY-MM-DD").isoWeek();
              if (i == 0) {
                startweek = weeknumber;
                for (let j = 0; j < lastweek - startweek + 1; j++) {
                  week[j] = { date: '', count: 0 };
                }
              }
              week[weeknumber - startweek].date = day[i].date
              week[weeknumber - startweek].count = day[i].count + week[weeknumber - startweek].count;
            }
          }
        }
        app.io.emit('weeklys', week)
      },
    });
  });
  socket.on('setCount1Month', () => {
    var mon = []
    cnt = 0;
    app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: 0) |> timeShift(duration: 9h, columns: ["_time"]) |> filter(fn: (r) => r["_measurement"] == "OP10-3") 
                            |> filter(fn: (r) => r["_field"] == "count") |> aggregateWindow(every: 1mo, fn: count, createEmpty: false)`, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        t = o._time.split('T')[0]
        mon[cnt] = { date: t, count: o._value }
        cnt++;
      }, error(error) {
        console.error(error)
      }, complete() {
        for (let i = 0; i < mon.length; i++) {
          if (typeof (mon[i]) == 'undefined') {
            mon = mon.slice(i + 1, mon.length)
          }
        }
        if (mon.length > 1) {
          mon[mon.length-2].date = app.hnlib.InfluxAggregationTimeBug(mon[mon.length-2].date)
        }
        app.io.emit('monthlys', mon);
      },
    });
  });
  socket.on('setCycleTimeList', () => {
    let result_s = []
    let result_e = []
    let result_t = []
    count1 = 0
    count2 = 0
    count3 = 0
    let history = [];
    let lineHistory = [[], []]
    app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: -4d) |> filter(fn: (r) => r["_measurement"] == "OP10-3") |> tail(n: 100)`, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        if (o._field == 'startTime') {
          result_s[count1] = o._value;
          count1++;
        }
        if (o._field == 'endTime') {
          result_e[count2] = o._value;
          count2++;
        }
        if (o._field == 'cycleTime') {
          result_t[count3] = o._value / 1000;
          count3++;
        }
      }, error(error) {
        console.error(error)
      }, complete() {
        let i = 0
        for (i; i < result_s.length; i++) {
          if (typeof (result_s[i]) != 'undefined') {
            lineHistory[0][i] = result_e[i]
            lineHistory[1][i] = result_t[i];
            history[i] = { start: result_s[i], end: result_e[i], ct: hnlib.timestampTotime(result_t[i]) }
          }
        }
        if (i == result_s.length) {
          app.io.emit('ctHistory', history)
          lineHistory[0] = lineHistory[0].slice(lineHistory[0].length - 10, lineHistory[0].length)
          lineHistory[1] = lineHistory[1].slice(lineHistory[1].length - 10, lineHistory[1].length)
          app.io.emit('ctChart', lineHistory);
        }
      },
    });
  });
  socket.on('currentModelInfo', () => {
    // console.log("예지")
    // app.io.emit('nowModelInfo', {model: 'prediction_bi', processCnt: 4});
    let option = optionClone(options)
    option.path = option.path + 'info'
    http.get(option, function (res) {
      res.on("data", function (chunk) {
        chunk = chunk.toString('utf8');
        if (chunk.length > 10) {
          chunk = JSON.parse(chunk);
          // chunk[0].name = chunk[0].name.split('_')[1]
          app.io.emit('nowModelInfo', { model: chunk[0].name, processCnt: chunk.length });
          console.log('nowModelInfo', { model: chunk[0].name, processCnt: chunk.length })
        } else {
          console.log("stop 상태")
        }
      });
    }).on('error', function (e) {
      app.io.emit('nowModelInfo', { model: '', processCnt: 0 });
      console.log("Got error: " + e.message);
    });
  });

  socket.on('modelStop', (model) => {
    let option = optionClone(options)
    // option.path = option.path + model
    option.path = option.path + 'stop'

    http.get(option, function (res) {
      if (res.statusCode == 200) {
        res.on("data", function (chunk) {
          chunk = chunk.toString('utf8');
          chunk = JSON.parse(chunk);
          console.log('stop status ', res.statusCode, ' stop body ', chunk)
          if (chunk.State == 'Prediction Stop') {
            app.io.emit('modelChangRes', { state: 'Engine Stop Sucess' });
          } else {
            app.io.emit('modelChangRes', { state: 'Engine Stop Fail' });
          }
        });
      }
    }).on('error', function (e) {
      console.log("Got error: " + e.message);
    });
  });

  socket.on('modelStart', (model) => {
    let option = optionClone(options)
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
            app.io.emit('modelChangRes', { state: 'Engine Start Sucess' });
          } else {
            app.io.emit('modelChangRes', { state: 'Engine Start Fail' });
          }
        });
      }
    }).on('error', function (e) {
      console.log("Got error: " + e.message);
    });
  });

  socket.on('predictionDataStart', () => {
    console.log('igot')
    let con = 'cncWas'+ cnt
    cnt++
    console.log(con)
    consumerPredict = new kafka.ConsumerGroup({ kafkaHost: '9.8.100.152:9092', autoCommit: true, fromOffset: 'latest', outOfRangeOffset: 'earliest', groupId: con }, 'MH001001001-CNC001-detection');
    // console.log(consumerPredict)
    consumerPredict.on('message', function (message) {
      // console.log(message.timestamp)
      stt = stt +message.timestamp + '\n'
      // app.io.emit('isWork');
    });
  });
  socket.on('predictionDataStop', () => {
    console.log('i close')
    let file = 'f'+String(cnt-1)+'.txt'
    fs.writeFile(file, stt, 'utf8', function(err) {
      console.log('비동기적 파일 쓰기 완료');
  });
    consumerPredict.close(true, function (err, message) {
      console.log("consumer has been closed..");
    });
  });
  socket.on('socketTest', () => {
    console.log('socketTest!!!!!!!!!!!!!!!!!!')
  });
});
var cnt = 10;
var consumerPredict;
var stt = ""
var fs = require('fs');
// consuming 하면서 가동중인지 확인. 안보내면, ui에서 3초후 비가동으로 바꿈
consumer.on('message', function (message) {
  // console.log('work')
  app.io.emit('isWork');
});
// consumer2.on('message', function(message) {
//   console.log(message.value.split(',')[5])
//   app.io.emit('lossData10Mean', message.value.split(',')[5]);
// })


server.listen(8082);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function optionClone(obj) {
  var output = {};
  for (let i in obj) {
    output[i] = obj[i];
  }
  return output;
}

