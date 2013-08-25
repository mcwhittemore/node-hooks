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

	return {path: packageJsonPath, json:packageJson};
}