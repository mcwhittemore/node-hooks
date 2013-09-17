test_folder = process.cwd()+"/test/test_folder";
var exec = require("child_process").exec;
var should = require("should");
var colors = require("colors");
var fs = require("fs");

run = function(command, callback){

	var hookCommand = "node "+process.cwd()+"/bin/hooks.js ";

	var mods = [
		["hooks ", hookCommand],
		["--all-"+hookCommand, "--all-hooks "],
		[".git/"+hookCommand, ".git/hooks "]
	]

	var oldCommand;
	for(var i=0; i<mods.length; i++){
		do{
			oldCommand = command;
			command = command.replace(mods[i][0], mods[i][1]);
		} while(oldCommand!=command);
	}

	try{
		exec("cd "+test_folder+" && "+command, callback);
	}
	catch(err){
		callback(err);
	}
}

cleanUp = function(callback){
	exec("rm -rf "+test_folder, function(err, stderr, stdout){
		if(err){
			console.log(stderr);
		}
		callback(err);
	});
}

setUp = function(callback){
	exec("mkdir "+test_folder, function(err, stdout, stderr){
		if(err){
			console.log(stderr);
		}
		callback(err);
	});
}

readJson = function(file){
	var content = fs.readFileSync(file, {encoding:"utf8"});
	return JSON.parse(content);
}



before(function(done){
	cleanUp(function(){
		setUp(done);
	});
});

after(function(done){
	cleanUp(done);
});