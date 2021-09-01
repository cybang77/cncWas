var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
const {Point} = require('@influxdata/influxdb-client');
const hnlib = require('../bin/js/hnLibrary');
const fs = require('fs');
var path = require('path');
const __public = path.join(__dirname, '../public/predictImg/');

/* GET home page. */
router.get('/start', (req, res) => {
  // 예지한테 판정 작한다고 보내기
  let opData = {op: req.query.opcode, sn: req.query.sn}
  req.app.io.emit('qualityPredictStart', opData);
  // console.log('predict start::: ', req.query.opcode) //json opcode, sn 처리
  // console.log('predict start::: ', req.query.sn) //json opcode, sn 처리
  // // console.log('predict start::: ', res.query)
  res.status(200).send() // 200 code send 
});

router.post('/end',(req, res, next) => {
  // console.log('predict end::: ', req.query.opcode)
  // console.log('predict end::: ', req.query.sn)
  // console.log('predict end::: ', req.query.acc)
  // console.log('predict end::: ', req.query.predict)
  let fstream;
  let opData;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename); 
    opData = {op: req.query.opcode, sn: req.query.sn, fn: filename, acc: (parseFloat(req.query.acc)*100).toFixed(2), predict: req.query.predict}
    req.app.predictinfo = opData
    fstream = fs.createWriteStream(__public + filename);
    fs.writeFile(__public + 'predictInfo.txt', JSON.stringify(opData), function(err)  {
      if (err === null) { 
        console.log('predictInfo txt save success'); 
      } else { console.log('predictInfo txt save fail'); }
    })
    
    file.pipe(fstream);
    fstream.on('error', function (err) {
      console.log(err)
    });
    fstream.on('finish', function () {
      console.log('저장완료')
      req.app.io.emit('qualityPredictEnd', opData);
    });
  });
  //  파일 처리 
  res.send("OK");
});



module.exports = router;