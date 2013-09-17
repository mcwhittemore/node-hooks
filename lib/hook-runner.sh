#!/usr/bin/env node

var hook = "{hook-to-run}";

var fs = require("fs");
var exec = function(stub){
	require("child_process").exec(stub+" run ", function(err, stdout, stderr){
		if(stdout){
			console.log(stdout);
		}

		if(stderr){
			console.error(stderr);
		}

		if(err){
			process.exit(err.code);
		}
	});
}


if(fs.existsSync("./node_modules/.bin/hooks")){
	exec("./node_modules/.bin/hooks");
}
else{
	exec("hooks");
}