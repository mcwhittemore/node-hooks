#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode


	var run = function(args){
	}

	process.title = "chicken";

	var userArgs = process.argv.slice(2);

	if(userArgs.length==0){
		require("./commands/help")();
	}
	else{
		run(userArgs);
	}
}