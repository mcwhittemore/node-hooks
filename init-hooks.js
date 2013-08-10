var fs = require("fs");
var exec = require("child_process").exec;


//TODO: Move exhisting hooks into the hooks directory

var createFile = function(hook, fileName, content){
	var fileMade = function(err){
		if(err){
			console.error("`"+hook+"` could not be created", err);
			process.exit(1);
		}
		else{
			exec("chmod a+x "+fileName, chmodDone);
		}
	}

	var chmodDone = function(err, stdout, stderr){
		if(err){
			console.error("`"+hook+"` could not be created", err, stderr);
			process.exit(1);
		}
	}

	fs.writeFile(fileName, content, fileMade);
}

var hooks = [
	"applypatch-msg",
	"pre-applypatch",
	"post-applypatch",
	"pre-commit",
	"prepare-commit-msg",
	"commit-msg",
	"post-commit",
	"pre-rebase",
	"post-checkout",
	"post-merge",
	"pre-receive",
	"update",
	"post-receive",
	"post-update",
	"pre-auto-gc",
	"post-rewrite"
]

var baseContent = "#!/bin/sh" + "\n\n" + "node ./.node-hooks/run.js";

var numHooks = 16;


while(numHooks--){
	var hook = hooks[numHooks];

	var fileName = "./.git/hooks/"+hook;
	var content = baseContent + " " + hook;

	createFile(hook, fileName, content);
}