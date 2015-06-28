'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var util = require('util');

var promise = require('selenium-webdriver').promise;
var RemoteServer = require('selenium-webdriver/remote').SeleniumServer;

var SELENIUM_JAR_PATH =path.join(__dirname,'selenium-server-standalone-2.40.0.jar');
var SELENIUM_SERVER_JAR = 'SELENIUM_SERVER_JAR';
var CLOUD_JAR_PATH = process.env[SELENIUM_SERVER_JAR];

function getProdModeJarPath() {
  assert.ok(!!CLOUD_JAR_PATH,
      SELENIUM_SERVER_JAR + ' environment variable is NOT set');
  assert.ok(fs.existsSync(CLOUD_JAR_PATH),
      SELENIUM_SERVER_JAR + ' does not exist: ' + CLOUD_JAR_PATH);
  return CLOUD_JAR_PATH;
}


function Server() {
  var jarPath = process.env.SELENIUM_SERVER_JAR ? getProdModeJarPath() : SELENIUM_JAR_PATH;
  RemoteServer.call(this, jarPath, {
    port: 0
  });
}
util.inherits(Server, RemoteServer);

Server.prototype.start = function(opt_timeout) {
  var startServer = RemoteServer.prototype.start.bind(this, opt_timeout);
  return startServer();
};

exports.Server = Server;
