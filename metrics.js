var v5_counter = 0
var v3_counter = 0
var e503_counter = 0
var e404_counter = 0

exports.v3_inc = v3_counter_inc
exports.v5_inc = v5_counter_inc
exports.e503_inc = e503_counter_inc
exports.e404_inc = e404_counter_inc
exports.form_metrics = form_metrics

function v3_counter_inc(){
    v3_counter++
}


function v5_counter_inc(){
    v5_counter++
}


function e503_counter_inc(){
    e503_counter++
}


function e404_counter_inc(){
    e404_counter++
}

function form_metrics(){

    var v3_help     = '# HELP v3_requests_total Sum of all generated v3 UUIDs \n'
    var v3_result   = 'v3_requests_total' + "{path=/v3/, method=\"GET\", status=\"200\"}" +  v3_counter + '\n'
    var v5_help     = '# HELP v5_requests_total Sum of all generated v3 UUIDs \n'
    var v5_result   = 'v5_requests_total' + "{path=/v5/, method=\"GET\", status=\"200\"}" +  v5_counter + '\n'
    var e503_help   = '# HELP 503_errors_total Sum of all failed healthchecks \n'
    var e503_result = '503_errors_total' + "{path=/healthcheck, method=\"GET\", status=\"503\"}" +  e503_counter + '\n'
    var e404_help   = '# HELP 404_errors_total Sum of all requests on non-existing endpoints \n'
    var e404_result = '404_errors_total' + "{path=/, method=\"GET\", status=\"404\"}" +  e404_counter + '\n'

    return v3_help + v3_result + v5_help + v5_result + e503_help + e503_result + e404_help + e404_result
}