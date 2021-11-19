const app = require('../app');
const { Kafka } = require('kafkajs');
const config = require('./config/config')
 
const kafkajs = new Kafka(config.kafkaServer)

loss = [];
lossSum = 0;
app.buf.predictList = [];
app.buf.predictList.sort(function(a, b) {
  return parseInt(a[1], 10)-parseInt(b[1], 10);
});

const consumerjs = kafkajs.consumer(config.kafkaGroupId)

exports.run = async () => {
  // Consuming
  await consumerjs.connect()
  await consumerjs.subscribe(config.kafkaPredictConsumer) // 전처리데이터, 예측데이터
  await consumerjs.subscribe(config.kafkaTestConsumer) 

  await consumerjs.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch(topic) {
        case config.kafkaPredictConsumer.topic:
          let msg = message.value.toString().trim().split(',');
          app.buf.predictList.push(msg);
          msg[8] = parseFloat(msg[8]);
          loss.push(msg[8]);
          lossSum += msg[8];

          let anomaly = {"loss": msg[8], "anomaly": "판정중"}

          if(loss.length > 50) {
            if (lossSum/loss.length > 0.05) {
              anomaly["anomaly"] = "비정상";
            } else {
              anomaly["anomaly"] = "정상";
            }
            lossSum -= loss.shift();
          }
          app.io.to('streamUiRoom').emit('lossAndAnomaly', anomaly);
          break;
        default :
          console.log(topic, message.value.toString());
          break;
      }
    },
  })
} 
