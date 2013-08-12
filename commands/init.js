var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");

/** ================================================================================ **/

//TODO: Move exhisting hooks into the hooks directory

var main = function(args){

	//TODO: check if hooks is on the package.json file
	//TODO: Add defaults to devDevepencies
	//TODO: Install hooks

	var git = hasGit();
	var packageJson = hasPackageJson();

	var options = {};
	options.addDefaults = args.indexOf("--add-defaults") != -1 ? true : false;

	if(git && packageJson){
		createHooks();
		configurePackageJson(options);
	}
	
	if(!git){
		console.log("ERROR:".red+" hooks depends on "+ ".git".yellow);
		console.log("       Please run "+"`git init`".yellow+" before "+"`hooks init`".yellow);
	}

	if(!packageJson){
		console.log("ERROR:".red+" hooks depends on "+"package.json".yellow);
		console.log("       Please run "+"`npm init`".yellow+" before "+"`hooks init`".yellow);
	}

	if(!packageJson || !git){
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

var configurePackageJson = function(options){
	var packageJsonPath = process.cwd()+"/package.json";

	var packageJson = require(packageJsonPath);
	packageJson.hooks = packageJson.hooks == undefined ? {} : packageJson.hooks;

	if(options.addDefaults){
		packageJson.hooks = addDefaults(packageJson.hooks);
	}

	installHooks(packageJson.hooks, function(err, result){
		if(err){
			console.log("ERROR".red, err);
		}
		else{
			createFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', false);
		}
	});
}

var addDefaults = function(hooks){
	var defaults = require("../lib/default-modules");
	if(defaults.json!=undefined){
		//console.log("DEFAULTS", defaults.json);
		console.log("TODO: ADD AND INSTALL DEFAULTS".yellow);
	}
	else{
		console.error("DEFAULTS FILE IS MISSING".red);
	}
}

var installHooks = function(hooks, callback){

	callback(null, true);

}

/** ================================================================================ **/


var hasGit = function(){
	return fs.existsSync(".git");
}

var hasPackageJson = function(){
	return fs.existsSync("./package.json");
}

/** ================================================================================ **/


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

/** ================================================================================ **/


module.exports = main;