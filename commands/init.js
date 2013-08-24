var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");

/** ================================================================================ **/

var hooksJsonPath = process.cwd()+"/hooks.json";

/** ================================================================================ **/


var main = function(args){

	//TODO: Add defaults to devDevepencies
	//TODO: Install hooks

	var git = hasGit();
	var hooksJson = hasHooksJson();

	var options = {};
	options.addDefaults = args.indexOf("--add-defaults") != -1 ? true : false;

	if(git){
		createHooks(options);
		if(!hooksJson){
			createHooksJson(options);
		}
		else if(options.addDefaults){
			addDefaults(options);
		}
		else{
			installHooks(options);
		}
	}
	
	if(!git){
		console.log("ERROR:".red+" hooks depends on "+ ".git".yellow);
		console.log("       Please run "+"`git init`".yellow+" before "+"`hooks init`".yellow);
	}

	if(!git){
		process.exit(1);
	}
}

/** ================================================================================ **/

var createHooks = function(){

	var baseContent = "#!/bin/sh" + "\n\n" + "hooks run";
	var hooks = require("../lib/possible-hooks");
	var numHooks = hooks.length;

	while(numHooks--){
		var hook = hooks[numHooks];

		var fileName = "./.git/hooks/"+hook;
		var content = baseContent + " " + hook;

		createFile(fileName, content, true);
	}
}

var createHooksJson = function(options){
	var defaultHooksJson = {};
	createFile(hooksJsonPath, JSON.stringify(defaultHooksJson), false, function(){
		installHooks(options);
	});
}

var addDefaults = function(options){
	var defaults = require("../lib/default-modules");
	if(defaults.json!=undefined){
		//console.log("DEFAULTS", defaults.json);
		console.log("TODO: ADD AND INSTALL DEFAULTS".yellow);
	}
	else{
		console.error("DEFAULTS FILE IS MISSING".red);
	}

	installHooks(options);
}

var installHooks = function(options){
	var hooksJson = require(hooksJsonPath);

	var hooks = [];

	var hookTypes = require("../lib/possible-hooks");

	for(var i=0; i<hookTypes.length; i++){
		if(hooksJson[hookTypes[i]]!=undefined){
			var hookNames = Object.keys(hooksJson[hookTypes[i]]);
			for(var j=0; j<hookNames.length; j++){
				hooks.push({name:hookNames[j], version:hooksJson[hookTypes[i]][hookNames[j]]});
			}
		}
	}
	
	var installHook = function(i, hooks, callback){
		if(i<hooks.length){
			var command = "npm install "+hooks[i].name+"@"+hooks[i].version;
			exec(command, function(err, stdout, stderr){

				if(err){
					console.log(err.red);
				}

				if(stderr){
					console.log(stderr.red);
				}

				if(stdout){
					console.log(stdout.green);
				}

				installHook(i+1, hooks, callback);
			});
		}
		else{
			callback();
		}
	}

	var whenFinsihed = function(){
		console.log("INSTALLED");
	}

	installHook(0, hooks, whenFinsihed);
}

/** ================================================================================ **/


var hasGit = function(){
	return fs.existsSync(".git");
}

var hasHooksJson = function(){
	return fs.existsSync(hooksJsonPath);
}

/** ================================================================================ **/


var createFile = function(fileName, content, chmodX, callback){
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
		else if(callback!=undefined){
			callback();
		}
	}

	fs.writeFile(fileName, content, fileMade);
}

/** ================================================================================ **/


module.exports = main;