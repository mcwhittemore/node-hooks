var npmInstaller = require("npm-installer");
var colors = require("colors");


var install = function(hook_module, cb) {
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