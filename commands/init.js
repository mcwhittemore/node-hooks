var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");


//TODO: Move exhisting hooks into the hooks directory

var createFile = function(fileName, content, chmodX){
	var fileMade = function(err){
		if(err){
			console.error("`"+fileName+"` could not be created", err);
			process.exit(1);
		}
		else if(chmodX===true){
			exec("chmod a+x "+fileName, chmodDone);
		}
	}

	var chmodDone = function(err, stdout, stderr){
		if(err){
			console.error("`"+fileName+"` could not be created", err, stderr);
			process.exit(1);
		}
	}

	fs.writeFile(fileName, content, fileMade);
}

var createHooks = function(){

	var baseContent = "#!/bin/sh" + "\n\n" + "hooks run `pwd`";
	var hooks = require("../lib/possible-hooks");
	var numHooks = hooks.length;

	while(numHooks--){
		var hook = hooks[numHooks];

		var fileName = "./.git/hooks/"+hook;
		var content = baseContent + " " + hook;

		createFile(fileName, content, true);
	}
}

var hasGit = function(){
	return fs.existsSync(".git");
}

module.exports = function(args){

	if(hasGit()){
		createHooks();
	}
	else{
		console.log("ERROR".red+" git is required for hooks init");
	}

}