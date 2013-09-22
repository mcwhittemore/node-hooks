#!/usr/bin/env node

var hook = "{hook-to-run}";

var fs = require("fs");
var spawn = function(command){

	var hooks = require("child_process").spawn(command, ["run", hook]);

	hooks.stderr.on("data", function(data){
		process.stderr.write(data);
	});

	hooks.stdout.on("data", function(data){
		process.stdout.write(data);
	});

	hooks.on("error", function(){
		console.error("error", arguments);
	})

	hooks.on("close", function(code){
		process.exit(code);
	});
}


if(fs.existsSync("./node_modules/.bin/hooks")){
	//console.log("node_modules");
	spawn("./node_modules/.bin/hooks");
}
else{
	var pack = require(process.cwd()+"/package.json");
	if(pack.name=="node-hooks" && fs.existsSync(process.cwd()+"/bin/hooks.js")){
		//console.log("local");
		spawn("node "+process.cwd()+"/bin/hooks.js");
	}
	else{
		//console.log("global");
		spawn("hooks");
	}
}