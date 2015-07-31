/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var Austack = require('./austack-nodejs');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cors = require('cors');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
  origin: '*'
}));
app.use(express.methodOverride());
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