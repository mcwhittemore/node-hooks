var fs = require("fs");
var colors = require("colors");

var main = function(args){
	var hooks = require("../lib/possible-hooks");
	var numHooks = hooks.length;

	while(numHooks--){
		var hook = hooks[numHooks];

		var fileName = "./.git/hooks/"+hook;

		var action = 0;

		if(fs.existsSync(fileName)){
			//remove current
			fs.unlinkSync(fileName);
			action++;
		}

		if(fs.existsSync(fileName+".old")){
			//move old back in
			fs.renameSync(fileName+".old", fileName);
			action+=2;
		}

		if(action==1){
			console.log(hook.blue+" has been removed");
		}
		else if(action==2){
			console.log(hook.blue+" has been restored to its archived version");
		}
		else if(action==3){
			console.log(hook.blue+" has been replaced with its archived version");
		}
	}

	if(fs.existsSync("hooks.json")){
		fs.unlinkSync("hooks.json");
		console.log("hooks.json".blue+" has been removed");
	}
}

module.exports = main;