const app = require('../app');
const { Kafka } = require('kafkajs');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
 
const kafkajs = new Kafka({
  clientId: 'forScichart',
  brokers: ['9.8.100.152:9092']
})

// var predictQ = new FifoQueue(200000)
var predictList = [];
predictList.sort(function(a, b) {
  return parseInt(a[1], 10)-parseInt(b[1], 10);
});

const consumerjs = kafkajs.consumer({ groupId: 'forScichart' })

const run = async () => {
  // Consuming
  await consumerjs.connect()
  await consumerjs.subscribe({ topic: 'MH001001001-CNC002-predict', fromBeginning: false }) // 전처리데이터, 예측데이터
  await consumerjs.subscribe({ topic: 'MH001001001-CNC001', fromBeginning: false }) // 실제 데이터

  await consumerjs.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch(topic) {
        case 'MH001001001-CNC001':
          app.io.emit('iswork');
          break;
        case 'MH001001001-CNC002-predict':
          predictList.push(message.value.toString().trim().split(','))
          break;
      }
    },
  })
} 
run().catch(console.error);