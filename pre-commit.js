var exec = require('child_process').exec;
var fs = require('fs');

var reportFile = __dirname+"/test/test-report.json";

var newTests = false;
var oldTests = false;



var run = function(){
	runTests();
	loadTestReport();
}

var runTests = function(){
	exec("./node_modules/mocha/bin/mocha --reporter json", function(err, stderr, stdout){
		var testJson = JSON.parse(stderr);
		
		if(testJson.stats.failures>0){
			process.exit(1);
		}

		newTests = testJsonToTestReport(testJson);

		if(oldTests!=false){
			compareReports();
		}
	});
}

var loadTestReport = function(){
	fs.readFile(reportFile, function(err, data){

		if(err){
			if(err.code=="ENOENT"){
				oldTests = {};
			}
			else{
				console.error("FILE READ ERROR WITH `test-report.json`", err);
				process.exit(1);
			}
		}
		else{
			if(data==""){
				oldTests = {};
			}
			else{
				try{
					oldTests=JSON.parse(data);
				}
				catch(err){
					console.error("JSON PARSE ERROR with `test-report.json`", err);
					process.exit(1);
				}
			}
		}

		if(newTests!=false){
			compareReports();
		}

	});
}


var testJsonToTestReport = function(test_report){
	var report = {};

	var iTests = test_report.stats.tests;

	while(iTests--){
		if(report[test_report.tests[iTests].fullTitle]==undefined){
			report[test_report.tests[iTests].fullTitle] = "skipped";
		}
		else{
			console.error("DUPLICATED TEST", test_report.tests[iTests].fullTitle);
			process.exit(1);
		}
	}

	var iFailures = test_report.failures.length;

	while(iFailures--){
		report[test_report.failures[iFailures].fullTitle] = "failed";
	}

	var iPasses = test_report.passes.length;

	while(iPasses--){
		report[test_report.passes[iPasses].fullTitle] = "passed";
	}

	return report;
}

var compareReports = function(){

	var failed = false;
	
	var newTestNames = Object.keys(newTests);
	var iNewTestNames = newTestNames.length;

	var values = {
		"failed": 0,
		"new": 1,
		"skipped": 2,
		"passed": 3
	}

	while(iNewTestNames--){
		var newTest = newTests[newTestNames[iNewTestNames]];
		var oldTest = oldTests[newTestNames[iNewTestNames]] || "new";

		if(values[newTest]<values[oldTest]){
			failed = true;
			console.log("TEST `",newTestNames[iNewTestNames],"` IN UNEXCEPTABLE STATE ", newTest, " VS ", oldTest);
		}

		if(oldTest!="new"){
			delete oldTests[newTestNames[iNewTestNames]];
		}
	}

	if(Object.keys(oldTests).length!=0){
		console.log(oldTests);
		failed = true;

		var oldTestNames = Object.keys(oldTests);
		var iOldTestNames = oldTestNames.length;

		while(iOldTestNames--){
			console.log("TEST `",newTestNames[iNewTestNames],"` IN UNEXCEPTABLE STATE ", newTest, " VS ", oldTest);
		}
	}

	if(failed){
		console.log("FAILED");
		process.exit(1);
	}
	else{
		saveTestReport();
	}

}

var saveTestReport = function(){
	fs.writeFile(reportFile, JSON.stringify(newTests), function(err){
		if(err){
			console.error("FAILED TO SAVE TEST REPORT", err);
			process.exit(1);
		}
		else{
			process.exit(0);
		}
	});
}


run();
