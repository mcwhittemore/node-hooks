var exec = require('child_process').exec;

exec("./node_modules/mocha/bin/mocha --reporter json", function(err, stderr, stdout){
	var json = JSON.parse(stderr);
	
	if(json.stats.pending+json.stats.failure>0){
		process.exit(1);
	}
	else{
		process.exit(0);
	}
})