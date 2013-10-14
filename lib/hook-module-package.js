//used to find needed info from a hook-module
module.exports = function(hook, localPath) {
    //default path is in the node_modules path
    var packageJsonPath = process.cwd() + "/node_modules/" + hook + "/package.json";
    var packageJson;

    try {
        packageJson = require(packageJsonPath);
    } catch (e) {
        //if the default path can't be found, assue the localPath is a local path (it could also be a version number...)
        try {
            packageJsonPath = localPath;
            packageJson = require(packageJsonPath);
        } catch (ee) {
            //if the localPath can't be found, console.log a warning.
            console.log(("`" + hook + "`").red + " can't be found");
        }
    }

    //the default object to return
    var data = {
        path: packageJsonPath,
        json: packageJson,
        "default-hook": undefined
    };

    //if the packageJson was never set, return default data.
    if (packageJson == undefined) {
        return data;
    } else {
        //if the package.json looks like its for a valid hook-module, think about adding more info the data obj
        if (packageJson["hook-module"] != undefined) {

            //if the package.json has the valid-for arg, add it to the data.obj, for easy retreval.
            if (packageJson["hook-module"]["valid-for"]) {
                data["valid-for"] = [];

                if (typeof packageJson["hook-module"]["valid-for"] == "string") {
                    data["valid-for"].push(packageJson["hook-module"]["valid-for"]);
                } else if (typeof packageJson["hook-module"]["valid-for"] != "object") {
                    data["valid-for"] = packageJson["hook-module"]["valid-for"];
                }

            }
        }

        return data;
    }
}