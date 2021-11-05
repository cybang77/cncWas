var config = {};

config.influxdb = {
    host: '9.8.100.156',
    database: 'MH001001001-CNC001'
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

config.keyclock = {
    "realm": "cyservice",
    "auth-server-url": "http://9.8.100.153:8080/auth",
    "ssl-required": "none",
    "resource": "cybang"
}

module.exports = config;