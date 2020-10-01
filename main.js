const express = require('express')
const dotenv  = require('dotenv')
const os      = require('os') 
const gen     = require('./generators.js')
const metrics = require('./metrics.js')
dotenv.config()

var app = express()
var router = express.Router()

const log_path = process.env['LOG_PATH']

var timestamp = Math.floor(Date.now())

var fs = require('fs')
var util = require('util')
var log_file = fs.createWriteStream(__dirname + '/' + log_path + timestamp + '.log', {flags : 'w'})
var log_stdout = process.stdout

console.log = function(d) { 
  log_file.write(util.format(d) + '\n')
  log_stdout.write(util.format(d) + '\n')
};

router.get("/v3/:name", v3_handler)
router.get("/v5/:name", v5_handler)
router.get("/healthcheck", health_handler)
router.get("/metrics", metrics_handler)

app.use("/", router)
app.use( function(req,res) {
    console.log('Recieved a request on incorrect endpoint!')
    res.status(404).send("404 Not found!")
    metrics.e404_inc()
} )
app.use(express.json())

app.listen(8080, function(){ console.log("Waiting for incoming requests")})
console.log('Service started')


function v3_handler(req,res) {
    console.log('Request recieved, data: ', req.headers, req.params)
    var uuid_str = gen.uuid_v3(req.headers['sessionid'], req.params['name'])
    res.append('UUID', uuid_str).status(200).end()
    console.log('Sent a 200 OK response with uuid['+uuid_str+']')
}

function v5_handler(req,res) {
    console.log('Request recieved, data: ' 
                 + req.headers
                 + req.params)
    var uuid_str = gen.uuid_v5(req.headers['sessionid'], req.params['name'])
    res.append('UUID', uuid_str).status(200).end()
    console.log('Sent a 200 OK response with uuid['+uuid_str+']')
}

function health_handler(req,res) { 
    console.log('Recieved healthcheck request')
    load = os.loadavg()
    console.log('Current load(average 1min/5min/15min): '
                + load[0] + ' ' + load[1] + ' ' + load[2])
    if( load[0] > 0.9 || load[1] > 0.85 )
    {
        console.log('Load is close to critical for a prolonged time period, responding with 503')
        res.status(503).end()
        metrics.e503_inc()
    }
    else 
    {
        console.log('Load is OK')
        res.status(200).send('OK')
    }
    
}

function metrics_handler(req,res) {
    console.log('Recieved metrics request, forming response')
    result = metrics.form_metrics()
    res.status(200).send(result)
}