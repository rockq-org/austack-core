var testResult = require('../persistence/testresult').TestResult;

exports.list = function (req, res) {
  testResult.find({}, function (error, data) {
    if (error) {
      res.render('result', {
        title: 'Error while getting test results',
      });

    } else if (data === null) {
      res.render('result', {
        title: 'Error while getting test results',
      });
    } else {
      res.render('result', {
        title: 'Test Report',

      });
    }
  });
};

exports.showReport = function (req, res) {
  var timestamp = req.params.timestamp;
  testResult.find({
      timestamp: timestamp
    },
    function (error, data) {
      if (error) {
        console.log("Error getting result: " + error);
      } else if (data === null) {
        console.log("The result is empty!");
      } else {
        if (data.length > 0) {
          res.write(data[0].html.toString());
          res.end();
        }
      }
    });
};
