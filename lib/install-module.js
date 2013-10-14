var npmInstaller = require("npm-installer");
var colors = require("colors");

//installs a module and provides a callback with module's require name
//and the possibly versioned install path required for package.json

var install = function(hook_module, cb) {
    //hook_module can be either
    // * a npm module
    // * a local folder
    // * a tar file

    console.log("HOOKS:".blue + " INSTALLING `" + hook_module + "` ...".yellow);

    npmInstaller(hook_module, function(err, result) {
        if (err) {
            console.log("HOOKS:".blue + " INSTALL FAILED".red)
            cb(false);
        } else {
            console.log("HOOKS:".blue + " INSTALL COMPLETE");
            console.log("RESULT", result);
            var version = result.version;
            if (result.origin != result.module + "@" && result.origin != result.module_and_location) {
                version = result.origin;
            }
            cb(true, result.module, version);
        }
    });
}

module.exports = install;