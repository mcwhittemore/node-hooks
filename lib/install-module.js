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
            cb(true, result.module, result.version);
        }
    });
}

module.exports = install;