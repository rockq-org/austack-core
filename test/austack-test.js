'use strict';

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  util = require('util'),
  fs = require('fs'),
  request = require('superagent');

var result = require('./routes/result');
var index = require('./routes/index');
var testUtil = require('./utils/utility');
var scheduletest = require('./utils/scheduletest');

var app = express();

var page_title = 'Test Server for Austack';

// all environments
app.set('port', process.env.AUSTACK_TEST_PORT || 3666);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

global.url = "";
global.selenium = false;
global.serverAddr = "";

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// load the index page
app.get('/', function (req, res) {
  index.index(req, res);
});

// Schedule a test
app.post('/', function (req, res) {
  scheduletest.scheduleTest(req, res);
});

// Show results of a specific test
app.get('/timestamp/:timestamp', function (req, res) {
  result.showReport(req, res);
});

app.setMaxListeners(0);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
