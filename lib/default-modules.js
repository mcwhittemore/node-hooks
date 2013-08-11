var fs = require("fs");

var defaults = module.exports;

defaults.filename = __dirname+"/../../node-hooks-defaults.json";

try{
	defaults.json = require(defaults.filename);
	
	defaults.add = function(module, hook, force){
		
		force = hook===true || hook === false ? hook : force;
		force = force==undefined ? false : force;
		hook = hook===true || hook === false ? undefined : hook;

		//https://npmjs.org/doc/install.html
		//TODO: open package.json
		//TODO: Validate againts hook-module-spec
		//TODO: Set hook var to match module if hook var is undefined
	}

	defaults.remove = function(module, hook){

		//TODO: Set hook var to match default
		//TODO: handle hook var unset if default is not set

	}

	defaults.valid = true;

}
catch(e){
	defaults.valid = false;
}

defaults.save = function(callback){
	defaults.json = defaults.json || {};
	var content = JSON.stringify(defaults.json);
	fs.writeFile(defaults.filename, content, function(err){
		if(err){
			console.log("FAILED TO INSTALL", err);
			process.exit(1);
		}
		else{
			callback();
		}
	});
}

