var fs = require("fs");
var exec = require('child_process').exec;
var colors = require("colors");

var rootFolder = process.cwd();

var queue = function(keys, commands){

	var key = keys[0];

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

		keys = keys.slice(1);

		if(keys.length==0){
			process.exit(0);
		}
		else{
			queue(keys, commands);
		}
	});
}

var open = function(name, path, callback){
	var folder = "node_modules/"+name;
	fs.readFile(folder+"/package.json", function(err, data){
		if(err){
			fs.readFile(path+"/package.json", function(err, data){
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

		var command = type=="shell" ? folder+"/"+main : type+" "+folder+"/"+main;

		command += " \""+rootFolder+"\"";

		enact(command, callback);
	}
}

var enact = function(command, callback){

	var info = {
		err: undefined,
		stdout: undefined,
		stderr: undefined,
		exec_finished: false,
		exit_code: undefined,
		exit_signal: undefined,
		exit_happend: false
	}

	var close = function(){
		if(info.exec_finished && info.exit_happend){
			var message = info.stdout || info.stderr || info.exit_signal;
			var code = info.exit_code !=0 ? 1 : 0;
			callback(null, {code:code, message:message});
		}
	}

	var action = exec(command, function(err, stdout, stderr){
		info.err = err;
		info.stdout = stdout;
		info.stderr = stderr;
		info.exec_finished = true;

		close();
	});

	action.on("exit", function(code, signal){
		info.exit_code = code;
		info.exit_signal = signal;
		info.exit_happend = true;

		close();
	});
}

module.exports = function(args){

	var hook = args[0];

	fs.readFile("hooks.json", function(err, data){
		
		if(err){
			console.error("ERROR READING `hook.json`".red);
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
				queue(Object.keys(options[hook]), options[hook]);
			}
		}

	});
}