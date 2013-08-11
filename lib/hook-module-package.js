var rpj = require("read-package-json");

module.exports = function(hook_module, path){
	rpj.readJson(path+"node_modules/"+hook_module, console.log, false, function(err, data){
		console.log("RPJ ERR", err);
		console.log("RPJ DATA", data);
	});
}