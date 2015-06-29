'use strict';
var index = require('../routes/index');
var reporter = require('../report/reporter');
var datautils = require('../persistence/datautils');

var utility = require('./utility.js');
var commonConfig = utility.commonConfig;
var testcasesConfig = utility.testcasesConfig;
//var global.testsuite = testcasesConfig.pattern;
var testsuite = testcasesConfig.pattern;
var Mocha = require('mocha');
var mocha = new Mocha();
mocha.reporter(reporter).ui('bdd');

function scheduleTest(req , res, fn){
	var startTime = new Date();
	var timestamp = startTime.toString();
	var notified = "NO";
	reporter.setTimestamp(startTime);
	reporter.setNotified(notified);
	if (req.param('_url') === "" || req.param('_url') === null) {
		var url = (global.url === "" || global.url === undefined) ? commonConfig.defaultURL : global.url;
		global.url = url;
	} else {
		global.url = req.param('_url');
	}
	
	if (req.param('_testsuite') === "" || req.param('_testsuite') === null) {
		testsuite = testcasesConfig.pattern;
		console.log("No test suite parameter received, use default one "+testsuite);
	} else {
		testsuite = req.param('_testsuite');
		console.log("Receive test suite parameter : "+testsuite);
	}
	
	if (global.selenium === false){
		console.log("No available Selenium Webdriver found, no browser related testcases included in mocha testsuite.");
	}
	var allcases = utility.getCustomCases(global.selenium, testsuite);
	if(allcases){
		allcases.forEach(function(testcase){
			mocha.addFile(testcase);
		});
	}
	var tempResult = {
			timestamp : timestamp,
			notified : notified,
			result : "",
			summary : "In Progress",
			html : "Pending for Results",
			percentage : "In Progress",
			url : global.url
		};
	console.log("TIME STAMP = " + timestamp);
	datautils.addTestResult(tempResult, res);
	utility.sleep(1000);
    mocha.run();
    index.index(req, res);
}

exports.scheduleTest = scheduleTest;
