'use strict';

var path = require('path');
var request = require('superagent');
var _u = require('underscore');

var fs = require('fs');
var commonConfigFile = path.resolve(__dirname, '..', './test/configuration') + '/common_config.json';
var testcasesConfigFile = path.resolve(__dirname, '..', './test/configuration') + '/testcases_config.json';

var commonConfig = require(commonConfigFile);
var testcasesConfig = require(testcasesConfigFile);

/**
 * 
 * @param milliSeconds
 */
function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

/**
 * @returns 4 digits number to generate UUID
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * @returns {String} Return the generated UUID
 */
function genUUID() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getTestConfig(testCaseName) {
  var file;
  if (testCaseName.indexOf(".json") > 0) {
    file = testCaseName;
  } else {
    if (testCaseName.indexOf(".js", testCaseName.length - 3) >= 0) // only replace it if it is at the end of the String, e.g.,  /a/foo.js/bar/test.js
      file = testCaseName.slice(0, -3) + "_config.json";
    else
      file = testCaseName + "_config.json";
  }
  fs.exists(file, function (exists) {
    if (!exists) {
      console.log("Config file :" + file + " is not exist");
      process.exit(1);
    }
  });
  return file;
}

function getCustomCases(option, testsuite) {
  console.log('selenium option:' + option);
  var glob = require("glob");
  var pattern = testsuite;
  console.log("cases pattern:" + pattern);
  var selenium = testcasesConfig.selenium;
  var skip = testcasesConfig.skip;
  var skip_suite = [];
  var selenium_suite = [];
  var rest_suite = [];

  var matches = glob.sync(pattern);
  matches.forEach(function (match) {
    var parent = _u.last(path.dirname(match).slice(1).split('/'));
    if (_u.indexOf(testcasesConfig.selenium, parent) >= 0) {
      selenium_suite.push(path.resolve(match));
    } else if (_u.indexOf(testcasesConfig.skip, parent) >= 0) {
      skip_suite.push(path.resolve(match));
    } else {
      rest_suite.push(path.resolve(match));
    }
  });

  var suite = [];

  if (option) {
    suite = _u.difference(_u.union(rest_suite, selenium_suite), skip_suite);
  } else {
    suite = _u.difference(_u.difference(rest_suite, selenium_suite), skip_suite);
  }
  console.log('custom suite:' + suite);
  return suite;
}

function checkSeleniumEnv(req, res, fn) {

  //Web Driver Environment

  //{
  //	"seleniumwebdriver": [
  //	 {
  //	 "name": "xxx",
  //	 "version": "xxx",
  //	 "url": "http://server001.ng.w3.bluemix.net/wd/hub"
  //	 }
  //	]
  //}

  var seleniums = process.env.SELENIUM_WEBDRIVER ? JSON.parse(process.env.SELENIUM_WEBDRIVER) : {};

  if (seleniums.seleniumwebdriver) {
    seleniums.seleniumwebdriver.forEach(function (webdriver) {
      request.get(webdriver.url).end(
        function (response) {
          //						console.log("webdriver.url = " + webdriver.url);
          if (res.statusCode === 200 || res.statusCode === 206) {
            //							console.log("res status of webdriver:"+response.statusCode);
            global.selenium = true;
            global.serverAddr = webdriver.url;
            console.log("global serverAddr:" + global.serverAddr);
            console.log("global selenium:" + global.selenium);
          } else {
            global.selenium = false;
            global.serverAddr = undefined;
          }
          fn(req, res);
        });
    });
  }
}

// Public API

exports.getCustomCases = getCustomCases;
exports.checkSeleniumEnv = checkSeleniumEnv;
exports.commonConfig = commonConfig;
exports.testcasesConfig = testcasesConfig;
exports.sleep = sleep;
exports.getTestConfig = getTestConfig;
exports._u = _u;
exports.genUUID = genUUID();
