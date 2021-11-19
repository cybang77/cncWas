var app = require('../app');

app.buf.lossSum = 0;
app.buf.lossCount = 1;
app.buf.lossCollection = [];
app.buf.createInterval = false;
// connection시 인증 params
app.io.on('connection', (socket) => {
  console.log("connected!!!!!!!!!", socket.id)
  socket.join('streamUiRoom')

  // 연결 끊김
  socket.on("disconnect", () => {
    app.io.in('streamUiRoom').allSockets().then(res => {
      if (app.interval != undefined && res.size == 0){
        app.buf.createInterval = false;
        clearInterval(app.interval);
      }
    })
    socket.disconnect();
  });

  // 연결시 에러
  socket.on("error", () => {
    app.io.in('streamUiRoom').allSockets().then(res => {
      if (app.interval != undefined && res.size == 0){
        app.buf.createInterval = false;
        clearInterval(app.interval);
      }
    })
    socket.disconnect();
  });
  // 하루 생산량 ui 로드시 호출 됨. 추후 데이터 베이스 스키마 변경시 파라미터값 변경 예정
  socket.on('dayProductCounts', () => {
    let date = new Date()
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);
    // Date에서 제공하는 timestamp가 현재 korea기준으로 계산해 주기 때문에 generator와 timezone을 맞추기 위해 32400000 더해줌
    date = (date.getTime() + 32400000) * 1000000
    app.influxdb.query(`SELECT count("cycleTime") AS "count_cycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info" WHERE time > `+ date +` GROUP BY time(1d)`).then(result => {
      // 장비가 작동 중일 때
      if (result.length > 0) {
        app.buf.todayCounts = result[result.length-1]["count_cycleTime"];
        socket.emit("dayProductCounts", app.buf.todayCounts);
        // 장비가 중지 되어있을 때
      } else {
        app.buf.todayCounts = 0
        socket.emit("dayProductCounts", app.buf.todayCounts);
      }
    }).catch(err => {
      socket.emit("dayProductCounts", "[error] internal error.");
      console.error("[DeviceHealthCheck] check your code or query.");
    });
  });
  // 사이클 평균 시간 ui 로드시 호출 됨. 추후 데이터 베이스 스키마 변경시 파라미터값 변경 예정
  socket.on('cycleTime5Avg', () => {
    let date = new Date()
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);
    // Date에서 제공하는 timestamp가 현재 korea기준으로 계산해 주기 때문에 generator와 timezone을 맞추기 위해 32400000 더해줌
    date = (date.getTime() + 32400000) * 1000000
    app.influxdb.query(`SELECT mean("cycleTime") AS "mean_cycleTime" FROM "MH001001001-CNC001"."autogen"."cycle_info" ORDER BY time DESC LIMIT 5`).then(result => {
      // 장비가 작동 중일 때
      if (result.length > 0) {
        app.buf.todayCounts = result[result.length-1]["count_cycleTime"];
        socket.emit("cycleTime5Avg", app.buf.todayCounts);
        // 장비가 중지 되어있을 때
      } else {
        app.buf.todayCounts = 0
        socket.emit("cycleTime5Avg", app.buf.todayCounts);
      }
    }).catch(err => {
      socket.emit("cycleTime5Avg", "[error] internal error.");
      console.error("[cycleTime5Avg] check your code or query.");
    });
  });
  // scichart에 실시간으로 카프카에서 받은 데이터 보냄.
  socket.on('streamPredict', () => {
    // console.log('streamPredict')
    if (!app.buf.createInterval) {
      app.buf.createInterval = true
      app.interval = setInterval(() => {
        let res = ""
        let end = app.buf.predictList.length
        app.buf.predictList.sort(function(a,b) {
          return a[1] - b[1];
        })
        // 1000개 이상 데이터 가지고 있으면~ 최대 1000개 묶어서 보냄
        if(app.buf.predictList.length > 1000) {
          for(let i=0; i< 1000; i++){
            res += app.buf.predictList.shift().join(",")+"\n"
          }
          app.io.to('streamUiRoom').emit('streamPredict', res);
        }
        // 1000개 이하 데이터는 전부 한번에 묶어서 보냄
        else if(app.buf.predictList.length > 0) {
          for(let i=0; i< end; i++){
            res += app.buf.predictList.shift().join(",")+"\n"
          }
          app.io.to('streamUiRoom').emit('streamPredict', res);
        }
      }, 1000);
    }
  });
});