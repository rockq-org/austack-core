var u = require("util");
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

function dumpFile(content, path, callback) {
  fs.writeFile(path, content, function (err) {
    if (err) {
      console.log(err);
    } else {
      callback();
      console.log("The file was saved!");
    }
  });
};

function execCmd(cmd) {
  child = exec(cmd, function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
};

function processResults(content) {
  console.log("process results ...");
  // send html to /tmp/clcs-test-report.html
  dumpFile("report link - \n " + process.env.TestHOSTURL + ":3666/timestamp/" + encodeURIComponent(content.timestamp) + " \n \n" + content.summary, "/tmp/clcs-test-report.html", function () {
    console.log("send mails ...");
    var receivers = require('./recipients.json');
    receivers.forEach(function (x) {

      console.log(u.format("mailto %s ...", x));
      // TODO send email with nodemailer.
    });
  });
};

module.exports = {
  processResults: processResults
};
