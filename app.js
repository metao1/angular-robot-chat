var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.listen(process.env.PORT || 5000)

module.exports = app;

