var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'view')));

app.listen(8000, '0.0.0.0', function() {});

module.exports = app;

