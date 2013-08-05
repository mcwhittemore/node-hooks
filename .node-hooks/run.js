var fs = require("fs");
var exec = require('child_process').exec;

var run = function(hook){

	fs.readFile("hooks.json", function(err, data){
		
		if(err){
			console.error("ERROR READING `hook.json`");
			process.exit(1);
		}
		else{
			var options;

			try{
				options = JSON.parse(data);
			}
			catch(err){
				console.error("ERROR PARSING `hook.json`", err);
				process.exit(1);
			}


			if(options[hook]!=undefined){
				queue(Object.keys(options[hook]), options[hook]);
			}
			else{
				console.error("UNKNWON COMMAND `", hook, "`");
				process.exit(1);
			}
		}

	});
}

var queue = function(keys, commands){

	var iKeys = keys.length-1;
	var key = keys[iKeys];

	open(key, commands[key], function(err, result){
		if(err){
			console.error("ERROR ENACTING `", key, "`", err);
			process.exit(1);
		}
		else if(result.code==1){
			console.error(result.message);
			process.exit(1);
		}
		else if(result.message!=undefined){
			console.error(result.message);
		}

		delete keys[iKeys];

		if(keys.length==0){
			process.exit(0);
		}
		else{
			queue(keys, commands);
		}
	});
}

var open = function(name, path, callback){
	var folder = ".node-hooks/"+name+"/";
	fs.readFile(folder+"package.json", function(err, data){
		if(err){
			fs.readFile(path+"package.json", function(err, data){
				if(err){
					callback("CANNOT FIND `", name, "`");
				}
				else{
					prep(data, path, callback);
				}
			});
		}
		else{
			prep(data, folder, callback);
		}
	});
}

var prep = function(data, folder, callback){
	var options = undefined;

	try{
		options = JSON.parse(data);
	}
	catch(err){
		callback(err);
	}

	if(options){
		var main = options["main"] || "index.js";
		var type = options["type"] || "node";

		var command = type=="shell" ? folder+main : type+" "+folder+main;

		enact(command, callback);
	}
}

var enact = function(command, callback){
	exec(command, function(err, stderr, stdout){
		callback(null, {code: 1, message: {
			err: err,
			stderr: stderr,
			stdout: stdout
		}});
	});
}

var hook = process.argv[2];

run(hook);