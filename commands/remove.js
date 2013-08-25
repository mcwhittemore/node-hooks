var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");

/** ================================================================================ **/

var hooksJsonPath = process.cwd()+"/hooks.json";

/** ================================================================================ **/

var main = function(args){

	var opts = {
		hard: false,
		global: false,
		module: args[args.length-1];
	}

	for(var i=0; i<args.length-1; i++){
		if(args[i]=="--hard"){
			opts.hard = true;
		}
		else if(args[i]=="--default" || args[i]=="-d" || args[i]=="--global" || args[i]=="-g"){
			opts.global = true;
		}
		else{
			console.log(args[i].red+ " is not a valid argument on `hooks remove`".yellow);
			opts.valid = false;
		}
	}

	if(opts.hard && (opts.soft || opts.global)){
		console.log("Error".red+" --hard can't be combined with --soft or --default");
		opts.valid = false;
	}

	if(opts.global && (opts.soft || opts.hard)){
		console.log("Error".red+" --global can't be combined with --soft or --hard");
		opts.valid = false;
	}

	if(opts.valid){

		var hooksJsonFile = process.cwd()+"/hooks.json";
		var hooksJson = require(hooksJsonFile);

		console.log(hooksJson);

		// removeFromHooks(opts.module);

		// if(opts.hard){
		// 	removeFromPackage(opts.module);
		// }
		// else if(opts.global){
		// 	removeFromDefaults(opts.module);
		// }
	}

}

var removeFromHooks = function(json){
	delete hooksJson[opts.hook][opts.name];
	saveJson(hooksJsonFile, hooksJson, false); 
}

var removeFromDefaults = function(hook){
	var defaults = require("../lib/default-modules");
	var defaultsJsonFile = defaults.filename;
	var defaultsJson = require(defaultsJsonFile);
	defaultsJson.hooks[opts.hook][opts.name] = opts.version;
	saveJson(defaultsJsonFile, defaultsJson, true);
}

var removeFromPackage = function(hook){
	var packageJsonFile = process.cwd()+"/package.json";
	var packageJson = require(packageJsonFile);
	packageJson.dependencies = packageJson.dependencies == undefined ? {} : packageJson.dependencies;
	packageJson.dependencies[opts.name] = opts.version;
	saveJson(packageJsonFile, packageJson, false);
}

var saveJson = function(file, json, global){
	var content = JSON.stringify(json, null, 2) + '\n';
	fs.writeFile(file, content, function(err){
		if(err && err.code=="EACCES"){
			console.log("FILE PERMISSION ERROR".red+" The current user does not have access to write to "+file);
			if(global){
				console.log("Default hook setup often requires admin access".yellow);
			}
		}
		else if(err){
			console.log("ERROR: ".red+"saveing "+file);
		}
	});
}


module.exports = main;

