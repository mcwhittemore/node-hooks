#!/usr/bin/env node

var hook = "{hook-to-run}";

var fs = require("fs");
var exec = function(stub){
	var command = stub+" run "+hook;
	//console.log("COMMAND", command);
	require("child_process").exec(command, function(err, stdout, stderr){
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
	//console.log("node_modules");
	exec("./node_modules/.bin/hooks");
}
else{
	var pack = require(process.cwd()+"/package.json");
	if(pack.name=="node-hooks" && fs.existsSync(process.cwd()+"/bin/hooks.js")){
		//console.log("local");
		exec("node "+process.cwd()+"/bin/hooks.js");
	}
	else{
		//console.log("global");
		exec("hooks");
	}
}