module.exports = function(json, callback){

	var possibleHooks = require("../lib/possible-hooks");

	if(json["hook-module"] != undefined){
		if(json["hook-module"]["script-type"] != undefined){
			if(json["hook-module"]["valid-for"] != undefined){

				var valids = [];

				if(typeof json["hook-module"]["valid-for"]=="string"){
					valids.push(json["hook-module"]["valid-for"]);
				}
				else if(typeof json["hook-module"]["valid-for"]=="object"){
					callback("valid-for must be a string or an array");
				}
				else{
					valids = json["hook-module"]["valid-for"];
				}

				if(valids.length!=0){
					var allValids = true;

					for(var i=0; i<valids.length; i++){
						if(possibleHooks.indexOf(valids[i])==-1){
							allValids=valids[i];
							break;
						}
					}

					if(allValids===true){
						callback(null, "looks good");
					}
					else{
						callback(allValids+" is not a valid git-hook");
					}
				}
				else{
					callback("valid-for must have at least one git-hook");
				}
			}
			else{
				callback("valid-for must be defined");
			}
		}
		else{
			callback("script-type must be defined");
		}
	}
	else{
		callback("hook-module must be defined");
	}


}
