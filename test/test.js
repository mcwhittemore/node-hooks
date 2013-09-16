test_folder = process.cwd()+"/test/test_folder";
var exec = require("child_process").exec;
var should = require("should");
var colors = require("colors");
var fs = require("fs");

run = function(command, callback){

	var hookCommand = "node "+process.cwd()+"/bin/hooks.js"
	command = command.replace("hooks", hookCommand);
	command = command.replace(".git/"+hookCommand, ".git/hooks");

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