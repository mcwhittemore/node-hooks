#!/usr/bin/env node

var hook = "{hook-to-run}";
var hookArgs = process.argv.slice(2);

var fs = require("fs");
var spawn = function(command){

	var args = ["run", hook].concat(hookArgs);

	var hooks = require("child_process").spawn(command, args);

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
	var packPath = process.cwd()+"/package.json";
	if(fs.existsSync(packPath)){
		var pack = require(packPath);
		if(pack.name=="node-hooks" && fs.existsSync(process.cwd()+"/bin/hooks.js")){
			//console.log("local");
			spawn("node "+process.cwd()+"/bin/hooks.js");
		}
		else{
			//console.log("global");
			spawn("hooks");
		}
	}
	else{
		//console.log("global");
		spawn("hooks");
	}
}