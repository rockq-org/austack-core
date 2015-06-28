var mongoose = require('mongoose');

var db;
if (process.env["AUSTACK_TEST_DBURL"]) {
  console.log("Use Test Database : " + process.env["AUSTACK_TEST_DBURL"]);
  db = mongoose.connect(process.env["AUSTACK_TEST_DBURL"]);
} else {
  console.log("Use Uniform Test Database");
  db = mongoose
    .connect('mongodb://localhost:27017/testresult2');
}

var testResultSchema = mongoose.Schema({
  timestamp: String,
  notified: String,
  result: String,
  summary: String,
  html: String,
  percentage: String,
  url: String
});
var TestResult = mongoose.model('TestResult', testResultSchema);
console.log('init the db and schema');

module.exports = {
  TestResult: TestResult
};
