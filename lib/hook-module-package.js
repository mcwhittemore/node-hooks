module.exports = function(module, version){
	var packageJsonPath = process.cwd()+"/node_modules/"+hook+"package.json";
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
			console.log(("`"+module+"`").red+" can't be found");
			process.exit(1);
		}
	}

	console.log(packageJsonPath, packageJson);
}