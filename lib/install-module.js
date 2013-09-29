var fs = require("fs");
var colors = require("colors");
var exec = require("child_process").exec;

var running = true;
var success = false;
var node_module = undefined;
var module_version = undefined;

var install = function(hook_module, cb){
	process.stdout.write("Installing `"+hook_module+"` ");
	run(cb);
	exec("npm install "+hook_module+" --save", function(err, stdout, stderr){
		if(err){
			stop(" failed".red+"\nMessage: "+stdout.yellow+"\nError: "+stderr.red);
		}
		else{
			var pjDep = require(process.cwd()+"/package.json");
			success = true;
			var keys = Object.keys(pjDep.dependencies);
			node_module = keys[keys.length-1];
			module_version = pjDep.dependencies[node_module];
			fixPJ(pjDep);
			stop(" complete".green);
		}
	});
}

var run = function(cb){
	setTimeout(function(){
		if(running===true){
			process.stdout.write(".".yellow);
			run(cb);
		}
		else{
			console.log(running);
			cb(success, node_module, module_version);
		}
	}, 100);
}

var stop = function(msg){
	running = msg;
}

var fixPJ = function(pj){
	delete pj.dependencies[node_module];
	var content = JSON.stringify(pj, null, 2) + '\n';
	fs.writeFile(process.cwd()+"/package.json", content, function(err){
		if(err){
			var msg = "`"+node_module+"` has been added to package.json, and we can't seem to remove it...";
			console.log(msg.red);
		}
	});
}

module.exports = install;