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