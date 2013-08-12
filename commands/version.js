module.exports = function(log){
	var packageJson = require(__dirname+"/../package.json");
	if(log){
		console.log(packageJson.version);
	}
	return packageJson.version;
}