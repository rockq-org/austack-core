require('dotenv').load();

GLOBAL.logger = require('tracer').console({
  level: level,
  format: "{{timestamp}} {{path}}:{{line}} \n <{{title}}> {{message}}"
});

var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// 1. 设置支持cors
var cors = require('cors');
app.use(cors({
  origin: '*'
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// 2. 加载 Austack 代码库，添加austack-demo路由示范
var austackCfg = require('./austack-variables.json');
var Austack = require('austack-nodejs');
Austack.init({
  clientId: austackCfg.clientId,
  apiBaseURL: austackCfg.apiBaseURL,
  clientSecret: austackCfg.clientSecret
});

//获取 application jwt
Austack.getApplicationJwt() // 默认已经保存在内存中
  .then(function (applicationJwt) {
    // 你可以保存该applicationJwt到你的服务器数据库里
    console.log('success get applicationJwt', applicationJwt);
  });

// 路由示范
app.use('/austack-demo', require('./routes/austack-demo'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;