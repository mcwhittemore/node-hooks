var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");
var install = require("../lib/install-module");

/** ================================================================================ **/

var hooksJsonPath = process.cwd()+"/hooks.json";

/** ================================================================================ **/

var main = function(args){

	if(hasHooksJson()){
		var opts = setupOptions(args);
		if(opts.valid){
			install(opts.hook_module, function(success, node_module){
				if(success){
					if(!opts.force){
						var data = require("../lib/hook-module-package")(node_module);
						opts.name = node_module;
						opts.version = data.version;
						if(isValidHookModule(data.json)){
							if(opts.hook=="default"){
								opts.hook = data.json["hook-module"]["default-hook"];
							}
							addToFiles(opts);
						}
						else{
							console.log(("`"+opts.hook_module+"`").red+" could not be added as it does not match the hook-module specification. If you want to override this be use the `-f` option.");
						}
					}
					else{
						addToFiles(opts);
					}
				}
				else{
					console.log("oops");
				}
			});
		}
	}
	else{
		console.log("No `hooks.json` file was found!".red);
		console.log("\tRun `hooks install` to add hooks to this folder".yellow);
	}
}

/** ================================================================================ **/

var hasHooksJson = function(){
	return fs.existsSync(hooksJsonPath);
}


var setupOptions = function(args){
	var opts = {
		name: undefined,
		version: undefined,
		force: false,
		global: false,
		hook: "default",
		depend: false,
		hook_module: args[args.length-1],
		valid: true
	}

	for(var i=0; i<args.length-1; i++){
		var arg = args[i];
		
		if(arg=="--default" || arg=="-d" || arg=="--global" || arg=="-g"){
			opts.global = true;
		}
		else if(arg.indexOf("--hook")!=-1){
			opts.hook = arg.split("=")[1];
		}
		else if(arg == "-f" || arg == "--force"){
			opts.force = true;
		}
		else if(arg=="--depend"){
			opts.depend = true;
		}
		else{
			console.log(arg.red+ " is not a valid argument on `hooks add`".yellow);
			opts.valid = false;
		}
	}

	if(opts.hook == "default" && opts.force){
		console.log("-f, -force requires -hook".red);
		opts.valid = false;
	}

	if(opts.hook == undefined){
		console.log("--hook must be followed by =HOOK_NAME".red);
		opts.valid = false;
	}
	else if(opts.hook != "default"){
		var possible_hooks = require("../lib/possible-hooks");
		if(possible_hooks.indexOf(opts.hook)==-1){
			console.log(opts.hook.red+" is not a valid hook".yellow);
			opts.valid = false;
		}
	}

	return opts;
}

var isValidHookModule = function(json){
	var possible_hooks = require("../lib/possible-hooks");
	return json["hook-module"] != undefined && possible_hooks.indexOf(json["hook-module"]["default-hook"])!=-1;
}

var addToFiles = function(opts){

	if(opts.version==undefined || opts.version.match(/\d\.\d\.\d/)==null){
		opts.version = opts.hook_module.split("@")[1];
	}

	if(opts.version==undefined){
		//fall back is url
		opts.version = opts.hook_module;
	}

	if(opts.depend){
		var packageJsonFile = process.cwd()+"/package.json";
		var packageJson = require(packageJsonFile);
		packageJson.dependencies = packageJson.dependencies == undefined ? {} : packageJson.dependencies;
		packageJson.dependencies[opts.name] = opts.version;
		saveJson(packageJsonFile, packageJson, false);
	}

	if(opts.global){
		var defaults = require("../lib/default-modules");
		var defaultsJsonFile = defaults.filename;
		var defaultsJson = require(defaultsJsonFile);
		defaultsJson.hooks[opts.hook][opts.name] = opts.version;
		saveJson(defaultsJsonFile, defaultsJson, true);
	}

	var hooksJsonFile = process.cwd()+"/hooks.json";
	var hooksJson = require(hooksJsonFile);
	hooksJson[opts.hook][opts.name] = opts.version;
	saveJson(hooksJsonFile, hooksJson, false);
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

/** ================================================================================ **/

module.exports = main;