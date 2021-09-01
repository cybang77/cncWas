#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('cnc-was:server');
var http = require('http');
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
  cors: {
    origin: "http://9.8.100.153:8082",
    methods: ["GET", "POST"]
  },
  serveClient: true,
  transports: ['websocket']
});
app.io.sockets.setMaxListeners(0);

// connection시 인증 params
app.io.on('connection', (socket) => {
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

  socket.on('setCount1Day', () => {
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
          day[i].date = app.hnlib.InfluxAggregationTimeBug(day[i].date);
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
                  week[j] = { date: moment('2021'+(startweek+j), 'YYYYWW').format('YYYY-MM-DD'), count: 0 };
                  // console.log(day[i].date)
                }
              }
              // week[weeknumber - startweek].date = day[i].date
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
        // if (mon.length > 1) {
        //   console.log('monthly ===> ', mon.length, mon[mon.length-2].date)
        //   mon[mon.length-2].date = app.hnlib.InfluxAggregationTimeBug(mon[mon.length-2].date)
        // }
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
            history[i] = { start: result_s[i], end: result_e[i], ct: app.hnlib.timestampTotime(result_t[i]) }
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
          // console.log('nowModelInfo', { model: chunk[0].name, processCnt: chunk.length })
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

  socket.on('recentlyPredictInfo', () => {
    if (app.predictInfo == undefined) {
      fs.readFile('/home/rnd03/workspace/source/WAS/sprint1/public/predictImg/predictInfo.txt', 'utf-8', (err, data) => {
        if(err) {
          if (err.errno != -21) 
            console.log('wwww 261', err)
        } else {
          app.predicInfo = JSON.parse(data)
          app.io.emit('qualityPredictEnd', app.predicInfo)
        }
      })
    } else {
      app.io.emit('qualityPredictEnd', app.predicInfo)
    }
  });
});

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

// sprint3 isWork socket 통신을 위한 라이브러리
const { Kafka } = require('kafkajs')
 
const kafkajs = new Kafka({
  clientId: 'forScichart',
  brokers: ['9.8.100.152:9092']
})

const consumerjs = kafkajs.consumer({ groupId: 'forScichart' })

const run = async () => {
  // Consuming
  await consumerjs.connect()
  await consumerjs.subscribe({ topic: 'MH001001001-CNC001', fromBeginning: false }) // (전처리데이터) 실제 데이터

  await consumerjs.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log('kafka alive')
      // console.log(topic, " ", message.value.toString())
      switch(topic) {
        case 'MH001001001-CNC001':
          app.io.emit('isWork');
          break;
      }
    },
  })
} 
run().catch(console.error)
///////////////////// sprint3이후 아래 기능에 추가되어 지워질 부분 

// scichart socket connection 
// get Kafka Data

/*
  kafkajs 컨슈머를 통한 preprocess와 predict(load, loss)결과를 수신하여 버퍼에 적재하고 ws를 통해 클라이언트에 전송
*/
/* 
const { Kafka } = require('kafkajs')
 
const kafkajs = new Kafka({
  clientId: 'forScichart',
  brokers: ['9.8.100.152:9092']
})

let CONNECTION = false;
var Queue = require('queue-fifo');
var predictDataQueue = new Queue();
var preProcessedDataQueue = new Queue();
// const continuousDataQueue = [];
// let sendDataQueue = [];
const FifoQueue =  require('./js/FifoQueue');

const consumerjs = kafkajs.consumer({ groupId: 'forScichart' })

var preprocessedQ = new FifoQueue(200000)
var detectionQ = new FifoQueue(200000)
 
const run = async () => {
  // Consuming
  await consumerjs.connect()
  await consumerjs.subscribe({ topic: 'MH001001001-CNC001', fromBeginning: false }) // (전처리데이터) 실제 데이터
  await consumerjs.subscribe({ topic: 'MH001001001-CNC001-detection', fromBeginning: false }) // 판정, loss (예측)
 
  await consumerjs.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log('kafka alive')
      app.io.emit('isWork');
      // console.log(topic, " ", message.value.toString())
      switch(topic) {
        case 'MH001001001-CNC001':
          preprocessedQ.enqueue(message.value.toString());
          preProcessedDataQueue.enqueue(message.value.toString());
          // console.log('original data ', message.value.toString())
          // console.log('preprocessed');
          break;
        case 'MH001001001-CNC001-detection':
          detectionQ.enqueue(message.value.toString());
          predictDataQueue.enqueue(message.value.toString());
          // console.log('detection');
          break;
      }
      // continuousDataQueue.push(message.value.toString())
      // sendDataQueue.push(continuousDataQueue[0])
      // continuousDataQueue.shift()
      // if(sendDataQueue.length >= 1000) {
      //   sendDataQueue.shift()
      // }
    },
  })
}
 
run().catch(console.error)

//////////////////////////////////////////////////////////////////////////////
// web socket connection

var WebSocket = require('ws').Server;
var wss = new WebSocket({ port: 3000 });
var preProcessedData = ""
var predictData = ""

wss.on('connection', function(ws, req) {
  let ip = ws._socket.remoteAddress

  console.log(ip + " send you message to connect");

  ws.on('message', function(message) {
    console.log(ip + " : " + message);
    type = JSON.parse(message).type;

    switch(type) {
      case 'preprocessed':
        ws.interval = setInterval(() => {
          if (ws.readyState === ws.OPEN) {
              // console.log('pre ',preProcessedDataList)
              preProcessedData = mkList(preProcessedDataQueue)
              if (preProcessedData != 0) {
                console.log('Preprocessed Data 메시지 전송: ', preProcessedData.length)

                // console.log('end ',preProcessedDataList)
                // console.log(preProcessedData)
                ws.send(preProcessedData);
              }
          }
        }, 500);
        break;

      case 'predict':
        ws.interval = setInterval(() => {
          if (ws.readyState === ws.OPEN) {
            predictData = mkList(predictDataQueue)
            if (predictData != 0) {
              console.log('Predict Data 메시지 전송', predictData.length)
              ws.send(predictData)
            }
          }
        }, 500);
        break;
    }
  });
  ws.on('error', function(error) {
    console.log(ip + "error on connection, " + error);
  })

  ws.on('close', function() {
    console.log(ip + " closed connection");
    clearInterval(ws.interval);
  })
});

function  mkList(queue) {
  if (queue.size() == 0){
    return 0;
  }
  let data = "";
  let end = (queue.size() > 1000) ? 1000 : queue.size();
  for (let i = 0; i < end; i++){
    if (i == 0) {
      data = queue.dequeue();
    } else {
      data = data + "\n" + queue.dequeue();
    }
  }
  return data;
}
*/