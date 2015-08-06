/**
 * Module dependencies.
 */

require('dotenv').load();
var express = require('express');
var routes = require('./routes');
var Austack = require('./austack-nodejs');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors({
  origin: '*'
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/me', user.me);
app.get('/users', user.list);

Austack.getApplicationJwt()
  .then(function (applicationJwt) {
    console.log('success get applicationJwt', applicationJwt);
  });

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});