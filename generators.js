exports.uuid_v3 = uuid_v3
exports.uuid_v5 = uuid_v5

const uuid    = require('uuid')
const dotenv  = require('dotenv')
const metrics = require('./metrics')
dotenv.config()

const base     = process.env['BASE_UUID'] 

var uuid_v3_map = {}
var uuid_v5_map = {}

function uuid_v3(cookie, req_data){
    if( cookie in uuid_v3_map && req_data == uuid_v3_map[cookie] )
    {
        console.log('Found UUIDv3 in storage for sessionid[' + cookie + ']')
        return uuid_v3_map[cookie]
    }
    else
    {
        console.log('UUIDv3 not found in storage for sessionid[' + cookie +'] generating new')
        var tmp = uuid.v3(req_data, base)
        metrics.v3_inc()
        uuid_v3_map[cookie] = tmp
        return tmp
    }
}

function uuid_v5(cookie, req_data){
    if( cookie in uuid_v5_map && req_data == uuid_v5_map[cookie] )
    {
        console.log('Found UUIDv5 in storage for sessionid[' + cookie + ']')
        return uuid_v5_map[cookie]
    }
    else
    {
        console.log('UUIDv5 not found in storage for sessionid[' + cookie +'] generating new')
        var tmp = uuid.v5(req_data, base)
        metrics.v5_inc()
        uuid_v5_map[cookie] = tmp
        return tmp
    }
}
