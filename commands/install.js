var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");
var install = require("../lib/install-module");

/** ================================================================================ **/

var packageJsonPath = process.cwd()+"/package.json";
var hooksJsonPath = process.cwd()+"/hooks.json";

/** ================================================================================ **/


var main = function(args){

	//TODO: Add defaults to hooks.json


	var options = {};
	//options.addDefaults = args.indexOf("--add-defaults") == -1 ? false : true;
	options.soft = args.indexOf("--soft") == -1 ? false : true;
	options.bare = args.indexOf("--bare") == -1 ? false : true;
	options.hasHooksJson = hasHooksJson();
	options.hasPackageJson = hasPackageJson();

	var git = hasGit(options.bare);

	if(git){
		create(options);

		if(!options.soft && process.env.npm_package_name != "node-hooks"){
			exec("NODE_HOOKS=DO_NOT_INSTALL npm install node-hooks --save-dev", function(err, stdout, stderr){
				if(stdout){
					console.log(stdout);
				}

				if(stderr){
					console.error(stderr);
				}

				if(err){
					process.exit(err.code);
				}
			});
		}
	}
	else{
		console.log("ERROR:".red+" hooks depends on "+ "git".yellow);
		var bare = options.bare ? " --bare" : "";
		console.log("       Please run "+("`git init"+bare+"`").yellow+" before "+"`hooks install`".yellow);
		process.exit(1);
	}
}

/** ================================================================================ **/

var create = function(options){
	if(!options.hasPackageJson){
		createPackageJson(options);
	}
	else if(!options.hasHooksJson){
		createHooksJson(options);
	}
	else{
		createHooks(options);
		installHooks(options);
	}
}

var createPackageJson = function(options){
	var packageJson = {name:"default"};
	
	var jsonString = JSON.stringify(packageJson, null, 2) + '\n';
	createFile(packageJsonPath, jsonString, false, function(){
		options.hasPackageJson = true;
		create(options);
	});
}

var createHooksJson = function(options){
	var defaultHooksJson = {};
	
	var jsonString = JSON.stringify(defaultHooksJson, null, 2) + '\n';
	createFile(hooksJsonPath, jsonString, false, function(){
		options.hasHooksJson = true;
		create(options);
	});
}

var createHooks = function(options){


	var baseContent = fs.readFileSync(__dirname+"/../lib/hook-runner.sh", {encoding: "utf8"});
	var hooks = require("../lib/possible-hooks");
	var numHooks = hooks.length;

	var baseFileName = options.bare == true ? "./hooks/" : "./.git/hooks/";

	while(numHooks--){
		var hook = hooks[numHooks];

		var fileName = baseFileName+hook;

		if(fs.existsSync(fileName)){
			fs.renameSync(fileName, fileName+".old");
		}

		var content = baseContent.replace("{hook-to-run}", hook);

		createFile(fileName, content, true);
	}
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
			var hook = hooks[i].name+"@"+hooks[i].version;
			install(hook, function(success, node_module){
				installHook(i+1, hooks, callback);
			});
		}
		else{
			callback();
		}
	}

	var whenFinsihed = function(){
		console.log("hooks".blue+" has been added to this project");
	}

	installHook(0, hooks, whenFinsihed);
}

/** ================================================================================ **/


var hasGit = function(bare){
	if(!bare){
		return fs.existsSync(".git") && hasHooksFolder(bare);
	}
	else{
		return hasHooksFolder(bare);
	}
}

var hasHooksFolder = function(bare){
	if(bare){
		return fs.existsSync("hooks");
	}
	else{
		return fs.existsSync(".git/hooks");
	}
}

var hasHooksJson = function(){
	return fs.existsSync(hooksJsonPath);
}

var hasPackageJson = function(){
	return fs.existsSync(packageJsonPath);
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
		else{
			callback();
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



var forTheGlobalFile = function(){
	var version = "0.0.0";

	var start = function(){
		var defaults = require("./lib/default-modules");
		
		if(defaults.json==undefined){
			defaults.json = {};
		}

		if(defaults.json.version!=version){
			var old_version = defaults.json.version;
			upgrade(defaults.json, function(data){
				defaults.json = data;
				defaults.save(function(){
					if(old_version){
						console.log("UPGRADE SUCCESSFULL");
					}
					else{
						console.log("INSTALLATION SUCCESSFULL");
					}
				});
			});
		}
	}


	var upgrade = function(data, callback){

		switch(data.version){
			case undefined:
				data.version = "0.0.0";
				data.hooks = {
					"applypatch-msg": {},
					"pre-applypatch": {},
					"post-applypatch": {},
					"pre-commit": {},
					"prepare-commit-msg": {},
					"commit-msg": {},
					"post-commit": {},
					"pre-rebase": {},
					"post-checkout": {},
					"post-merge": {},
					"pre-receive": {},
					"update": {},
					"post-receive": {},
					"post-update": {},
					"pre-auto-gc": {},
					"post-rewrite": {}
				}
		}

		callback(data);
	}

	start();
}