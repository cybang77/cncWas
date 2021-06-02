#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('cnc-was:server');
var http = require('http');
var io = require('socket.io');
var moment = require('moment');
const { InfluxDB } = require('@influxdata/influxdb-client');
const { time } = require('console');
app.hnlib = require('../bin/js/hnLibrary')
const influx = new InfluxDB({
  url: "http://9.8.100.156:8086",
  token: "uOpIW55Map8EuwijejVYQkSlwtq1J_C8etbJxrRyOdl7jjS8cVRRKLnjJHmDSKs-urArRwqZYKlJqa3cxNZsNg=="
})

app.lossSum = 0;
app.lossCount = 1;
app.lossCollection = [];
app.work = 'stop'

// create http server
var server = http.createServer(app);
app.influxdb = influx
app.influxQuery = app.influxdb.getQueryApi('HN')

app.io = io(server, {
  cors: {
    origin: "http://9.8.100.153:1234",
    methods: ["GET", "POST"]
  },
  serveClient: true,
  transports: ['websocket']
});

app.io.on('connection', (socket) => {
  console.log('socket connected');

  socket.on('setCount', () => {
    app.io.emit('count', app.totalCount)
  });
  socket.on('setWork', () => {
    let health
    app.influxQuery.queryRows(`from(bucket: "cnc") |> range(start: -3s) |> filter(fn: (r) => r["_measurement"] == "OP10-3")`, {
    next(row, tableMeta) {
      health = tableMeta.toObject(row)
    },
    error(error) {
      console.error(error)
    },
    complete() {
      if(typeof(health) == 'undefined') {
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
      },
      error(error) {
        console.error(error)
      },
      complete() {
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
        day[cnt] = {date: t, count: o._value}
        cnt ++;
        app.todayCount = o._value
      },
      error(error) {
        console.error(error)
      },
      complete() {
        for(let i=0; i<day.length-1; i++){
          day[i].date = app.hnlib.InfluxAggregationTimeBug(day[i].date);
        }
        app.io.emit('days', day) 

        if (typeof(day) != "undefined") {
          for(let i = 0; i < day.length; i++) {
            if(typeof(day[i]) != 'undefined') {
              weeknumber = moment(day[i].date, "YYYY-MM-DD").isoWeek();
              lastweek = moment(day[day.length-1].date, "YYYY-MM-DD").isoWeek();
              if( i ==0 ){
                startweek = weeknumber;
                for (let j =0; j< lastweek-startweek+1; j++) {
                  week[j] = {date: '', count: 0};
                }
              }
              week[weeknumber-startweek].date = day[i].date
              week[weeknumber-startweek].count = day[i].count + week[weeknumber-startweek].count;
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
        mon[cnt] = {date: t, count: o._value}
        cnt ++;
      },
      error(error) {
        console.error(error)
      },
      complete() {
        for(let i = 0; i < mon.length; i++) {
          if (typeof(mon[i]) == 'undefined') {
            mon = mon.slice(i+1,mon.length)
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
    app.io.emit('cycleTimeHistory', app.history)
    app.io.emit('ctChart',app.lineHistory);
  });
});

setInterval(() => {
  let health
  app.influxQuery.queryRows(`from(bucket: "cnc") |> range(start: -10s, stop: now()) |> filter(fn: (r) => r["_measurement"] == "OP10-3")`, {
    next(row, tableMeta) {
      health = tableMeta.toObject(row)
    },
    error(error) {
      console.error(error)
    },
    complete() {
      if(typeof(health) == 'undefined') {
        app.io.emit('isWork', 'stop');
      } else {
       app.io.emit('isWork', 'start');
      }
    },
  });
}, 3000);

server.listen(1234);
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

app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start:0)|> filter(fn: (r) => r["_measurement"] == "OP10-3")
       |> filter(fn: (r) => r["_field"] == "count") |> count(column: "_value")`, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)
    app.totalCount = o._value
    app.io.emit('count', app.totalCount)
  },
  error(error) {
    console.error(error)
  },
    complete() {
  },
});

let result_s = []
let result_e = []
let result_t = []
count1 = 0
count2 = 0
count3 = 0
app.lineHistory = [[],[]]
app.history = []
app.influxQuery.queryRows(`from(bucket: "cycle_info") |> range(start: -4d) |> filter(fn: (r) => r["_measurement"] == "OP10-3") |> tail(n: 100)`, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row)
    if(o._field == 'startTime') {
      result_s[count1] = o._value;
      count1++;
    } 
    if(o._field == 'endTime') {
      result_e[count2] = o._value;
      count2++;
    }
    if(o._field == 'cycleTime') {
      result_t[count3] = o._value/1000;
      count3++;
    }
  },
  error(error) {
    console.error(error)
  },
  complete() {
    let i =0
    for(i; i< result_s.length; i++) {
      if (typeof(result_s[i]) != 'undefined') {
        app.lineHistory[0][i] = result_e[i];
        app.lineHistory[1][i] = parseFloat(result_t[i]).toFixed(3)
        app.history[i] = {start: result_s[i], end: result_e[i], ct: app.hnlib.timestampTotime(result_t[i])}
      }
    } 
    if (i == result_s.length){
      app.lineHistory[0] = app.lineHistory[0].slice(-10);
      app.lineHistory[1] = app.lineHistory[1].slice(-10);
      app.io.emit('cycleTimeHistory', app.history)
      app.io.emit('ctChart',app.lineHistory);
    }
  },
});