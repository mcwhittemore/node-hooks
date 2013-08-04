var exec = require('child_process').exec;
var fs = require('fs');


var newTests = false;
var oldTests = false;


var toDictionary = function(test_report){
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

var save = function(){
	process.exit(0);
}

var judge = function(){

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

		if(values[newTests]<values[oldTest]){
			failed = true;
			console.log("TEST `",newTestNames[iNewTestNames],"` IN UNEXCEPTABLE STATE ", newTest, " VS ", oldTest);
		}

		if(oldTest!="new"){
			delete oldTests[newTestNames[iNewTestNames]];
		}
	}

	if(oldTests.length!=0){
		failed = true;

		var oldTestNames = Object.keys(oldTests);
		var iOldTestNames = oldTestNames.length;

		while(iOldTestNames--){
			console.log("TEST `",newTestNames[iNewTestNames],"` IN UNEXCEPTABLE STATE ", newTest, " VS ", oldTest);
		}
	}

	if(failed){
		process.exit(1);
	}
	else{
		save();
	}

}



exec("./node_modules/mocha/bin/mocha --reporter json", function(err, stderr, stdout){
	var test_report = JSON.parse(stderr);
	
	if(test_report.stats.failures>0){
		process.exit(1);
	}

	newTests = toDictionary(test_report);

	if(oldTests!=false){
		judge();
	}
});


fs.readFile(__dirname+"/test/test-report.json", function(err, data){

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
		judge();
	}

});
