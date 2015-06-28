var datautils = require('../persistence/datautils');
var mailResult = require('./mailResult');

var timestamp;
var startTime;
var notified;
var result = "";
var percentage = "";
var summary = "";
var html;

function Reporter(runner) {
	var passes = 0;
	var failures = 0;
	 
	html = '<html>';
	html = html.toString() + ('<head>');
	html = html.toString() + ('<title>Test Report</title>');
	html = html.toString() + ('<style type="text/css">');
	html = html.toString() + ('body { font: 15px "Lucida Grande", Helvetica, Arial, sans-serif;}');
	html = html.toString() + ('h2 { margin:0 ; padding:0 }');
	html = html.toString() + ('pre { font: 12px courier Mono; margin-left: 1em; padding-left: 1em; margin-top:0; font-size:smaller;}');
	html = html.toString() + ('.assertion_message { margin-left: 1em; }');
	html = html.toString() + ('  ol {' +
			' list-style: none;' +
			' margin-left: 1em;' +
			' padding-left: 1em;' +
			' text-indent: -1em;' +
			'}');
	html = html.toString() + ('  ol li.pass:before { content:   }');
	html = html.toString() + ('  ol li.fail:before { content:   }');
	html = html.toString() + ('</style>');
	html = html.toString() + ('</head>');
	html = html.toString() + ('<body>');
	html = html.toString() + ('<a href="/"><< Back</a><p></p>');
	var testReportURL = "";
	if(process.env.REPORTDIR !== undefined && process.env.REPORTDIR !== ""){
		console.log(process.env.REPORTDIR);
		testReportURL=process.env.TestHOSTURL+process.env.REPORTDIR+"/WebUITestReport.html";
		html = html.toString() + (
				'<a href="'+testReportURL+
				'">Check WebUI Test Results >></a><p></p>');
	}
	html = html.toString() + ('<h2 style="font-size: 25pt;color:gray">Austack Test Report</h2>');
	html = html.toString() + ( '<p style="color:gray;font-size: 12pt"><strong>Start Time: </strong>'+timestamp + '</p><ol>');
	var notify = true;

	var suiteName;
	runner.on('pass', function(test){
    passes = passes + 1;
    result = result + ('pass: ' + test.fullTitle() + '\n');
    
    var suite = (test.fullTitle()).replace(test.title, "");
    if (suite != suiteName) {
    	
    	suiteStartTime = new Date().toString();

    	html = html + ('</ol><h3 style="background:gray;color:white;font-size: 20pt">' + suite + '</h3><ol><p style="color:gray"><b>START TIME : </b>'+suiteStartTime+'</p>');
    
    }
//    html = html + ('<ol>');
    html = html.toString() + ('<li class="pass" style="color:green"><b> Pass: ' + test.title + '</b></li>');
//    html = html.toString() + ('</ol>');
    suiteName = suite;
  });

  runner.on('fail', function(test, err){
    failures = failures + 1;
    result = result + ('fail: ' + test.fullTitle() + '-- error:' + err.message);
    
    var suite = (test.fullTitle()).replace(test.title, "");
    if (suite !== suiteName) {
    	html = html + ('</ol><h3 style="background:gray;color:white;font-size: 20pt">' + suite + '</h3><ol><p style="color:gray"><b>START TIME : </b>'+new Date().toString()+'</p>');
    }
    
//    html = html + ('<ol>');
    html = html.toString() + ('<li class="fail" style="color:red"><b> Failed:' + test.title + '</b></li>');
    html = html.toString() + ('<div class="assertion_message">' +
            '<strong>Assertion Message: </strong>' + err.message.replace(/<([^<][^>]*)>/g, "[$1]") +
        '</div>');
    html = html.toString() + ('<pre>');
    html = html.toString() + ('</pre>');
//    html = html.toString() + ('</ol>');
    suiteName = suite;
  });

	runner.on('end', function(){
		var end = new Date();
		var duration = end.getTime() - startTime.getTime();
		var total = passes + failures;
		percentage = ((passes/total)*100).toFixed(2) + "%";
		summary = passes + "/" + total + " testcases passed";
		result = result + ('end: ' +  percentage );
//		html = html.toString() +'</ol><ol>';
		if(total != passes){
			html = html.toString() + (
                  '</ol><p style="color:gray"><b>END TIME : </b> '+end.toString()+'</p><h2 style="background:pink;color:white">FAILURES: '  + passes +
                  '/' + total + ' cases passed (' +
                  duration + ' ms)</h2><ol>'
              );
		}else{
			html = html.toString() + (
                  '</ol><p style="color:gray"><b>END TIME : </b> '+end.toString()+'</p><h2 style="background:lightgreen;color:white">ALL PASS: ' + total +
                  ' assertions (' + duration + ' ms)</h2><ol>'
              );
		}
		html = html.toString() + ('</ol></body>');
		html = html.toString() + ('</html>');
		console.log("Reporters.... now updating the record");
		var fullResult = {
				'timestamp' : timestamp,
				'notified' : notified,
				'result' : result,
				'summary': summary,
				'html': html,
				'percentage': percentage,
				'url': global.url
			};
		datautils.updateTestResult(timestamp, fullResult);
		if(notify && process.env.REPORTDIR !== undefined && process.env.REPORTDIR !== ""){
			console.log("Notify stakeholders....");
			var report_summary = "Austack WEB UI Test Report URL : "+testReportURL+"\n Execution Date : "+timestamp+"\n"+"Total : "+total+"\n Pass: "+passes+"\n Fail: "+failures;
			var content = {
				'timestamp' : timestamp,
				'summary' : report_summary
			};
			mailResult.processResults(content);
			notify = false;
		}
  });
}

Reporter.getResult = function(){
	var json = {
		'timestamp' : timestamp,
		'notified' : notified,
		'result' : result,
		'summary': summary,
		'html': html,
		'percentage': percentage,
		'url': global.url
	};
	return json;
};

Reporter.setTimestamp = function(newTimestamp){
	startTime = newTimestamp;
	timestamp = newTimestamp.toString();
};

Reporter.setNotified = function(notifiedData){
	notified = notifiedData;
};

module.exports = Reporter;
