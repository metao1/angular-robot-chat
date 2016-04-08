var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var request = require('request');

var app = express();


app.set('port', process.env.PORT ||80);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'client')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var server = require('http').Server(app);
app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'), function () {
    console.log('App is running on port', app.get('port'));
});

var headers ={
  "Access-Control-Allow-Origin" :"*"
};

///from client request
app.post('/talk', function (req, res) {
    var query = req.body.q;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var userReq = {
        ip: ip,
        query: query,
        time:getFormattedDate()
    };
    console.log(userReq);
    query= encodeURIComponent(query);

    request.get({url: "http://www.zabaware.com/webhal/chat.asp?q="+query,
        headers: headers, json: true}, function (err, response, profile) {
        res.status(200).send({time:userReq.time,response: profile.HalResponse});
    });

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }
});
