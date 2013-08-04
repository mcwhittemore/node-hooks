var fs = require("fs");

var getPackage = function(name, path){
	var file = ".node-hooks/"+name+"/package.json";
	fs.readFile(file, function(err, data){
		var options = JSON.parse(data);
		console.log(name, options);
		process.exit(0);
	});
}

var preCommit = function(commands){
	var keys = Object.keys(commands);

	var iKeys = keys.length;

	while(iKeys--){
		var key = keys[iKeys];
		getPackage(key, commands[key]);
	}
}

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


			if(hook=="pre-commit"){
				preCommit(options[hook]);
			}
			else{
				console.error("UNKNWON COMMAND `", hook, "`");
				process.exit(1);
			}
		}

	});
}

var hook = process.argv[2];

run(hook);