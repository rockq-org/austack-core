var TestResult = require('./testresult').TestResult;

exports.addTestResult  = function(newResult, res) {
	newResult = JSON.stringify(newResult);

	var newTestResult = new TestResult(JSON.parse(newResult));

	TestResult.find({timestamp : newTestResult.timestamp},function(error, docs) {
		if (error) {
			res.json(error);
		} else if (docs === null) {
			console.log("data is null");
		} else if (docs.length > 0) {
			console.log("failure, the test result with timestamp '" + newTestResult.timestamp + "' exists");
		} else {
			newTestResult
				.save(function(err) {
					if (err) {
						console.log("database.js: Error saving a test result: " + err);
						res.send("failure");
					} else {
						console.log("Added a new test result");
					}
				});
		}
	});
};

exports.updateTestResult = function(timestamp,fullResult, res){
	TestResult.findOneAndUpdate(
			{timestamp: timestamp}, 
			fullResult, 
		function(error, data){
			if (error) {
			console.log("Error getting result for timestamp: " + timestamp + "\n" + error);
			res.send("update record failure");
			} else if (data === null) {
				console.log("The result for timestamp " + timestamp + " is empty!");
			} else {
				console.log("Record updated!");
			}
	});
};