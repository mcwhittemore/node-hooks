var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require("child_process").spawn;
var colors = require("colors");

var rootFolder = process.cwd();

var main = function(args){

	var hook = args[0];

	var hooks = require("../lib/possible-hooks");

	if(hooks.indexOf(hook)==-1){
		console.error(hook.blue+" is not a valid git-hook".red);
		process.exit(1);
	}

	fs.readFile("hooks.json", function(err, data){
		
		if(err){
			console.error("ERROR READING `hook.json`".red);
			console.log(">> "+"Has hooks been merged into this branch?".blue);
			process.exit(1);
		}
		else{
			var options;

			try{
				options = JSON.parse(data);
			}
			catch(err){
				console.error("ERROR PARSING `hook.json`".red, err);
				process.exit(1);
			}

			if(options[hook]!=undefined){
				queue(hook, Object.keys(options[hook]), options[hook]);
			}
		}

	});
}

var queue = function(hook, keys, commands){

	var key = keys[0];

	open(hook, key, commands[key], function(err, exit_code){
		if(err){
			console.error("ERROR ENACTING `", key, "`", err);
			process.exit(1);
		}
		else if(exit_code!=0){
			process.exit(exit_code);
		}

		keys = keys.slice(1);

		if(keys.length==0){
			process.exit(0);
		}
		else{
			queue(keys, commands);
		}
	});
}

var open = function(hook, name, path, callback){
	var folder = "node_modules/"+name;
	fs.readFile(folder+"/package.json", function(err, data){
		if(err){
			fs.readFile(path+"/package.json", function(err, data){
				if(err){
					callback("CANNOT FIND `", name, "`");
				}
				else{
					prep(hook, data, path, callback);
				}
			});
		}
		else{
			prep(hook, data, folder, callback);
		}
	});
}

var prep = function(hook, data, folder, callback){
	var options = undefined;

	try{
		options = JSON.parse(data);
	}
	catch(err){
		callback(err);
	}

	if(options){
		var file = options["main"] || "index.js";
		var type = options["hook-module"]!=undefined ? options["hook-module"]["script-type"] || "node" : "node";

		enact(hook, type, folder+"/"+file, callback);
	}
}

var enact = function(hook, type, file, callback){

	var command = type == "shell" ? file : type;

	var args = [];
	if(command!=file){
		args.push(file);
	}

	args.push(hook);

	var hook = spawn(command, args);
		
	hook.stderr.on("data", function(data){
		process.stderr.write(data);
	});

	hook.stdout.on("data", function(data){
		process.stdout.write(data);
	});

	hook.on("error", function(err){
		console.error("HOOKS:", err.message);
	})

	hook.on("close", function(code){
		callback(undefined, code);
	});

}

module.exports = main;