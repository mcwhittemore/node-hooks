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
		module: args[args.length-1],
		hook: "default",
		valid: true
	}

	for(var i=0; i<args.length-1; i++){
		if(args[i]=="--hard"){
			opts.hard = true;
		}
		// NEEDS MORE THOUGHT
		// else if(args[i]=="--default" || args[i]=="-d" || args[i]=="--global" || args[i]=="-g"){
		// 	opts.global = true;
		// }
		else if(args[i]=="--hook"){
			if(opts.hook!="default"){ opts.valid = false; console.log("You cannot use --hook after --all-hooks".red)};
			opts.hook = args[i+1];
			i++;
		}
		else if(args[i]=="--all-hooks"){
			if(opts.hook!="default"){ opts.valid = false; console.log("You cannot use --all-hooks after --hook".red)};
			opts.hook = "all";
		}
		else{
			console.log(args[i].red+ " is not a valid argument on `hooks remove`".yellow);
			opts.valid = false;
		}
	}

	if(opts.hard && opts.global){
		console.log("Error".red+" --hard and --default cannot be combined");
		opts.valid = false;
	}

	if(opts.module == undefined){
		opts.valid = false;
		console.log("You must supply a module to be removed".red);
	}

	if(opts.valid){

		removeFromHooks(opts);

		if(opts.hard){
			removeFromPackage(opts);
		}
		else if(opts.global){
			removeFromDefaults(opts);
		}
	}

}

var removeFromHooks = function(opts){
	var hooksJsonFile = process.cwd()+"/hooks.json";
	var hooksJson = require(hooksJsonFile);

	var needsSave = false;

	if(opts.hook=="all"){
		var allHooks = Object.keys(hooksJson);
		for(var i=0; i<allHooks.length; i++){
			if(hooksJson[allHooks[i]][opts.module]!=undefined){
				removeMessage(opts.module, allHooks[i], " hooks.json");
				delete hooksJson[allHooks[i]][opts.module];
				needsSave = true;
			}
		}
	}
	else{

		if(opts.hook=="default"){
			var moduleJson = require("../lib/hook-module-package")(opts.module);
			if(moduleJson["default-hook"]==undefined){
				console.log(("`"+opts.module+"` does not have a default hook. Use --hook to specify one").red);
			}
			else if(hooksJson[moduleJson["default-hook"]][opts.module]==undefined){
				console.log(("`"+opts.module+"` has not been installed on its default hook.").red);
			}
			else{
				opts.hook = moduleJson["default-hook"];
			}
		}

		if(opts.hook!="default" && hooksJson[opts.hook] != undefined && hooksJson[opts.hook][opts.module] != undefined){
			delete hooksJson[opts.hook][opts.module];
			needsSave = true;
			removeMessage(opts.module, opts.hook, " hooks.json");
		}
		else{
			console.log("Unable to remove ".red+("`"+opts.module+"`").cyan+" from ".red+("`"+opts.hook+"`").yellow);
		}
	}

	if(needsSave){
		saveJson(hooksJsonFile, hooksJson, false); 
	}
}

var removeFromDefaults = function(opts){
	var defaults = require("../lib/default-modules");
	var defaultsJsonFile = defaults.filename;
	var defaultsJson = require(defaultsJsonFile);

	var needsSave = false;

	if(opts.hook=="all"){
		var allHooks = Object.keys(defaultsJson.hooks);
		for(var i=0; i<allHooks.length; i++){
			if(defaultsJson.hooks[allHooks[i]][opts.module]!=undefined){
				removeMessage(opts.module, allHooks[i], "user defaults");
				delete defaultsJson.hooks[allHooks[i]][opts.module];
				needsSave = true;
			}
		}
	}
	else if(opts.hook!="default" && defaultsJson.hooks[opts.hook]!= undefined && defaultsJson.hooks[opts.hook][opts.module] != undefined){
		delete defaultsJson.hooks[opts.hook][opts.module];
		needsSave = true;
		removeMessage(opts.module, opts.hook, "user defaults");
	}
	else if(opts.hook=="default"){
		var moduleJson = require("../lib/hook-module-package")(opts.module);
		if(moduleJson["default-hook"]==undefined){
			console.log(("`"+opts.module+"` does not have a default hook. Use --hook to specify one").red);
		}
		else if(defaultsJson.hooks[moduleJson["default-hook"]][opts.module]==undefined){
			console.log(("`"+opts.module+"` has not been installed on its default hook.").red);
		}
		else{
			delete defaultsJson.hooks[moduleJson["default-hook"]][opts.module];
			needsSave = true;
			removeMessage(opts.module, moduleJson["default-hook"], "user defaults");
		}
	}
	else{
		console.log("Unable to remove ".red+("`"+opts.module+"`").cyan+(" from `"+opts.hook+"`").red);
	}

	if(needsSave){
		saveJson(defaultsJsonFile, defaultsJson, true); 
	}
}

var removeFromPackage = function(opts){
	var packageJsonFile = process.cwd()+"/package.json";
	var packageJson = require(packageJsonFile);

	if(packageJson.devDependencies!=undefined && packageJson.devDependencies[opts.module] != undefined){
		delete packageJson.devDependencies[opts.module];
		removeMessage(opts.module, "devDependencies", "package.json");
		saveJson(packageJsonFile, packageJson, false); 
	}
	else{
		console.log(("Unable to remove `"+opts.module+"` from package.json devDependencies.").red, opts);
	}
}

var removeMessage = function(module, hook, file){
	console.log("Removeing "+("`"+module+"`").cyan+" from "+hook.yellow+" in "+file.cyan)
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

