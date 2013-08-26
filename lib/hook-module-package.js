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
			data["default-hook"] = packageJson["hook-module"]["default-hook"];
		}

		return data;
	}
}