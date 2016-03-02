/**
 * Main application file
 */
'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('date-util');

var express = require('express');
var socketio = require('socket.io');
var config = require('./config/index');
var socketConfig = require('./services/socketio');
var db = require('./persistence/database');
var app = express();
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cors = require('cors');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
// var favicon = require('serve-favicon');
var errorHandler = require('errorhandler');
var passport = require('passport');
var config = require('./config');
var logger = require('./common').loggerUtil.getLogger('app');

// expose the function to start the server instance
app.startServer = startServer;
app.serverShutdown = serverShutdown;

// log every request header in console.log
app.use(function (req, res, next) {
  var arr = [
    '/css/style.css',
    '/img/logo.png',
    '/img/favicon.ico'
  ];
  // if( arr.indexOf(req.originalUrl) === -1 ){
  //   console.log('================================ originalUrl', req.originalUrl);
  //   console.log('================================ baseUrl', req.baseUrl);
  //   console.log('================================ body', req.body);
  //   console.log('================================ params', req.params);
  //   console.log('================================ path', req.path);
  // }

  next();
});

// Setup Express

var env = app.get('env');
var distDir = path.join(config.root, config.distDir);
console.log(distDir);
var publicDir = path.join(config.root, config.publicDir);

logger.info(distDir, publicDir);

app.set('ip', config.ip);
app.set('port', config.port);

app.set('views', config.root + '/server/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cors(config.corsOptions));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb'
}));
app.use(bodyParser.json({
  limit: '5mb'
}));
app.use(methodOverride());
// app.use(cookieParser());
app.use(session({
  name: 'austack-api.sid',
  secret: config.secrets.session,
  proxy: true,
  resave: true
}));
app.use(passport.initialize());
// app.use(favicon(path.join(publicDir, 'favicon.ico')));

if ('production' === env || 'staging' === env) {
  app.use(express.static(distDir));
  app.use(express.static(publicDir));
  app.set('appPath', publicDir);
  app.use(morgan('tiny'));
}

if ('development' === env || 'test' === env) {
  app.use(express.static(path.join(config.root, '.tmp/serve')));
  app.use(express.static(path.join(config.root, 'client')));
  app.use('/bower_components', express.static(path.join(config.root, 'bower_components')));
  app.use(express.static(publicDir));
  app.set('appPath', publicDir);
  app.use(morgan('dev'));
  // Error handler - has to be last
  app.use(errorHandler());
}

// Setup Routes
require('./routes')(app);

// register the shutdown handler to close the database connection on interrupt signals
process
  .on('SIGINT', serverShutdown)
  .on('SIGTERM', serverShutdown);

/**
 * Create an express http server and return it
 * Config the socketio service to use this server
 * @api private
 * @return
 */
function startServer() {
  var server = require('http').createServer(app);
  var socket = socketio(server, {
    serveClient: (config.env !== 'production'),
    path: '/socket.io-client'
  });
  // Setup SocketIO
  socketConfig(socket);
  return server;
}

/**
 * Shutdown handler
 * Closes the database connection on iterrupt and exits the process
 * @api private
 */
function serverShutdown() {
  db.connection.close(function connectionClose() {
    console.log('Database connection disconnected through app termination');
    process.exit(0);
  });
}

// Expose app
exports = module.exports = app;