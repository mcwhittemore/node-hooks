var fs = require("fs");

var preCommit = function(commands){
	
}

module.exports = function(type){

	fs.readFile("hooks.json", function(err, data){
		console.log("ERROR", err);
		console.log("DATA", data);
		process.exit(1);
	})

}