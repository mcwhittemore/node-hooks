module.exports = function(log) {
    //load the package.json
    var packageJson = require(__dirname + "/../package.json");
    if (log) {
        //log the version if we want to log it
        console.log(packageJson.version);
    }
    //return the version number
    return packageJson.version;
}