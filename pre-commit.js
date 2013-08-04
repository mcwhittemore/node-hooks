var exec = require('child_process').exec;
var fs = require('fs');

var reportFile = __dirname+"/test/test-report.json";

var newTestReport = false;
var oldTestReport = false;



var start = function(){
	
	exec("git stash -q --keep-index", function(){
		runTests();
	});

	loadTestReport();
}

var runTests = function(){
	exec("./node_modules/mocha/bin/mocha --reporter json", function(err, stderr, stdout){
		var testJson = JSON.parse(stderr);
		
		if(testJson.stats.failures>0){
			stop(1);
		}

		newTestReport = testJsonToTestReport(testJson);

		if(oldTestReport!=false){
			compareReports();
		}
	});
}

var loadTestReport = function(){
	fs.readFile(reportFile, function(err, data){

		if(err){
			if(err.code=="ENOENT"){
				oldTestReport = {};
			}
			else{
				console.error("FILE READ ERROR WITH `test-report.json`", err);
				stop(1);
			}
		}
		else{
			if(data==""){
				oldTestReport = {};
			}
			else{
				try{
					oldTestReport=JSON.parse(data);
				}
				catch(err){
					console.error("JSON PARSE ERROR with `test-report.json`", err);
					stop(1);
				}
			}
		}

		if(newTestReport!=false){
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
			stop(1);
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
	
	var newTestNames = Object.keys(newTestReport);
	var iNewTestNames = newTestNames.length;

	var values = {
		"failed": 0,
		"new": 1,
		"skipped": 2,
		"passed": 3
	}

	var newTests = [];

	while(iNewTestNames--){
		var newTest = newTestReport[newTestNames[iNewTestNames]];
		var oldTest = oldTestReport[newTestNames[iNewTestNames]] || "new";

		if(values[newTest]<values[oldTest]){
			failed = true;
			console.error("`",newTestNames[iNewTestNames],"` is in an unexceptable state! Was", oldTest, "is", newTest);
		}

		if(oldTest!="new"){
			delete oldTestReport[newTestNames[iNewTestNames]];
		}
		else{
			newTests.push(newTestNames[iNewTestNames]);
		}
	}

	if(Object.keys(oldTestReport).length!=0){

		var oldTestNames = Object.keys(oldTestReport);
		var iOldTestNames = oldTestNames.length;

		while(iOldTestNames--){
			console.log("`", oldTestNames[iOldTestNames],"` is missing.");
			if(newTests.length>0){
				console.log("Is it one of these?", newTests);
			}
		}

		stop(1);
	}

	if(failed){
		console.error("Your commit has not been accepted. See above for details.");
		stop(1);
	}
	else{
		saveTestReport();
	}

}

var saveTestReport = function(){
	fs.writeFile(reportFile, JSON.stringify(newTestReport), function(err){
		if(err){
			console.error("FAILED TO SAVE TEST REPORT", err);
			stop(1);
		}
		else{
			stop(0);
		}
	});
}

var stop = function(exit_code){
	exec("git stash pop -q", function(){
		process.exit(exit_code);
	});
}


start();
