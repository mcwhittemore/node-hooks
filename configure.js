//stops install/uninstall command if on a global run
if(process.env.npm_config_global!=="true" && process.env.NODE_HOOKS != "DO_NOT_INSTALL"){

	var fs = require("fs");

	var spawn = require("child_process").spawn;
	
	var cwd, file;

	if(fs.existsSync(process.cwd()+"/../.bin/hooks")){
		//being installed a project folder
		cwd = process.cwd()+"/../..";
		file = process.cwd()+"/.bin/hooks";
	}
	else{
		//being installed inside itself
		cwd = process.cwd();
		file = process.cwd()+"/.bin/hooks";
	}

	console.log("file", file);
	if(fs.existsSync(file)){
		console.log("CWD", cwd);
		var child = spawn("node", [file, process.argv[2]], cwd);

		child.stderr.on("data", function(data){
			process.stderr.write(data);
		});

		child.stdout.on("data", function(data){
			process.stdout.write(data);
		});

		child.on("error", function(err){
			console.error("HOOKS:", err.message);
		})

		child.on("close", function(code){
			console.log("CLOSING");
			process.exit(code);
		});
	}
	else{
		console.log("hhhhhh");
		process.exit(1);
	}
	
}