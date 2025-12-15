var express = require("express");
var app = express();

var api_routes = require('./api_routes_dev.js');
app.use('/api', api_routes);

app.use('/demo', express.static('front_end'));

if (require.main === module) {
    app.listen(3000, function() {
        console.log('Server is running on port 3000');
    });
    //console.log(employee);
}

module.exports = app;
