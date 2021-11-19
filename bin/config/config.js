var config = {};

config.influxdb = {
    host: '9.8.100.156',
    database: 'MH001001001-CNC001',
    protocol: 'http',
    options : {
        timeout :  50 * 1000
    }
}

config.influxdb2 = {
    url: "http://9.8.100.156:8086",
    token: "uOpIW55Map8EuwijejVYQkSlwtq1J_C8etbJxrRyOdl7jjS8cVRRKLnjJHmDSKs-urArRwqZYKlJqa3cxNZsNg=="
}

config.modelChange = {
    hostname: '9.8.100.151',
    port: 8080,
    path: '/process/prediction/',
    method: 'GET'
}

config.kafkaServer = {
    clientId: 'forScichart',
    brokers: ['9.8.100.152:9092']
}

config.kafkaGroupId = {
    groupId: 'forScichart'
}

config.kafkaPredictConsumer = {
    topic: 'MH001001001-CNC002-predict', 
    fromBeginning: false 
}

config.kafkaTestConsumer = {
    topic: /test.topic.*/, 
    fromBeginning: false 
}

module.exports = config;