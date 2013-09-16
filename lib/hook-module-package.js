module.exports = function(hook, version){
	var packageJsonPath = process.cwd()+"/node_modules/"+hook+"/package.json";
	var packageJson;

	try{
		packageJson = require(packageJsonPath);
	}
	catch(e){
		try{
			packageJsonPath = version;
			packageJson = require(packageJsonPath);
		}
		catch(ee){
			console.log(("`"+hook+"`").red+" can't be found");
		}
	}

	var data = {
		path: packageJsonPath, 
		json:packageJson,
		"default-hook": undefined
	};

	if(packageJson==undefined){
		return data;
	}
	else{
		if(packageJson["hook-module"] != undefined){

			if(packageJson["hook-module"]["valid-for"]){
				data["valid-for"] = [];

				if(typeof packageJson["hook-module"]["valid-for"]=="string"){
					data["valid-for"].push(packageJson["hook-module"]["valid-for"]);
				}
				else if(typeof packageJson["hook-module"]["valid-for"] !="object"){
					data["valid-for"] = packageJson["hook-module"]["valid-for"];
				}

			}
		}

		return data;
	}
}