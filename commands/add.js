var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");

/** ================================================================================ **/

var hooksJsonPath = process.cwd()+"/hooks.json";

/** ================================================================================ **/


var main = function(args){

	var opts = {
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


	if(hasHooksJson()){
		console.log("ADD", opts);
	}
	else{
		console.log("No `hooks.json` file was found!".red);
		console.log("\tRun `hooks install` to add hooks to this folder".yellow);
	}
}

var addToDefaults = function(){

}

var isValidHookModule = function(){

}

var addToDepends = function(){

}


var hasHooksJson = function(){
	return fs.existsSync(hooksJsonPath);
}

module.exports = main;