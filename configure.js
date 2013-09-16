//stops install/uninstall command if on a global run
if(process.env.npm_config_global!=="true"){

	var fs = require("fs");

	if(fs.existsSync(process.cwd()+"/../.bin/hooks")){
		var exec = require("child_process").exec;
		var command = "cd ../.. && "+process.cwd()+"/../.bin/hooks "+process.argv[2];
		exec(command, function(err, stdout, stderr){
			console.log(stdout);
			console.log(stderr);
			if(err){
				process.exit(err.code);
			}
		});
	}
	else{
		require(process.cwd()+"/commands/"+process.argv[2])([]);
	}

	
}