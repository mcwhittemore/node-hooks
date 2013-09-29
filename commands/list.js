var request = require('request');
var colors = require("colors");

var main = function(args){

	var listFile = "https://raw.github.com/mcwhittemore/node-hooks/dev/list.json";

	request(listFile, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try{
	    		var data = JSON.parse(body);
	    		showAll(data);
			}
			catch(err){
				console.error("There seems to be an error with the list file. Please report this bug: ", "https://github.com/mcwhittemore/node-hooks/issues?state=open", err);
			}
	  	}
	  	else{
	  		console.error("There seems to be an error with getting the file from github. Are they down?", listFile);
	  	}
	});

}

var showAll = function(data){
	process.stdout.write('\u001B[2J\u001B[0;0f');
	var hook_modules = Object.keys(data);
	var i = hook_modules.length;
	while(i--){
		showOne(hook_modules[i], data[hook_modules[i]]);
	}
}

var showOne = function(name, data){
	console.log(">".blue ,name.green);
	console.log(">".blue ,data.desc.yellow);
	console.log(">".blue ,"Applicable Git Hooks".yellow);
	for(var i=0; i<data["valid-for"].length; i++){
		console.log(">".blue ,"\t", data["valid-for"][i].blue);
	}

	var add = data.sources.npm || data.sources.github;

	console.log(">".blue ,"To Add:".yellow, ("hooks add "+add).green);
	console.log("");
}


module.exports = main;