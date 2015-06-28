/*
 * GET home page.
 */
var testResult = require('../persistence/testresult').TestResult;
var utility = require('../utils/utility');
var commonConfig = utility.commonConfig;
var testcasesConfig = utility.testcasesConfig;
//Get the correct URL for testing
var url = (global.url === "" || global.url === undefined) ? commonConfig.defaultURL : global.url;

var testsuite = testcasesConfig.pattern;

exports.index = function (req, res) {
  testResult.find().sort({
    "timestamp": -1
  }).exec({}, function (error, data) {
    if (error) {
      res.render('index', {
        title: 'Error while getting test results',
      });

    } else if (data === null) {
      res.render('index', {
        title: 'Error while getting test results',
      });
    } else {
      res.render('index', {
        title: 'Austack Automation Test Framework',
        results: data,
        defaultURL: url,
        defaultTC: testsuite
      });
    }
  });
};
