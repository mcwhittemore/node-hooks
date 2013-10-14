var fs = require("fs");
var exec = require("child_process").exec;
var colors = require("colors");

/** =============================== INTERNAL MODULES =============================== **/

var install = require("../lib/install-module");

/** ================================== FILE PATHS ================================== **/

var hooksJsonFile = process.cwd() + "/hooks.json";

/** ================================================================================ **/

var main = function(args) {
    //load hooks file

    if (args.length != 0) {
        require("./add.js")(args);
    } else if (fs.existsSync(hooksJsonFile)) {
        installFromHooksJson();
    } else {
        console.log("HOOKS: ".blue + "Nothing to install!".yellow);
        console.log("HOOKS: ".blue + "As of 0.0.15 the hooks setup process has been moved to" + "`hooks init`".yellow);
    }

}

var installFromHooksJson = function() {
    var hooksJson = require(hooksJsonFile);

    var hooks = [];

    var hookTypes = require("../lib/possible-hooks");

    //get all the hooks that need to be installed out of the hooks.json file
    for (var i = 0; i < hookTypes.length; i++) {
        if (hooksJson[hookTypes[i]] != undefined) {
            var hookNames = Object.keys(hooksJson[hookTypes[i]]);
            for (var j = 0; j < hookNames.length; j++) {
                hooks.push({
                    name: hookNames[j],
                    version: hooksJson[hookTypes[i]][hookNames[j]]
                });
            }
        }
    }

    //start the async loop
    installLoop(0, hooks);
}

//recurse through hooks | the async loop
var installLoop = function(i, hooks) {
    if (i < hooks.length) {
        var hook;

        //if version is a vector, install this version of the hook-module
        if (hooks[i].version.match(/\d\.\d\.\d/) != null) {
            hook = hooks[i].name + "@" + hooks[i].version;
        }
        //else assume its a file path and install that
        else {
            hook = hooks[i].version;
        }

        install(hook, function(success, node_module) {
            installLoop(i + 1, hooks);
        });

    } else {
        console.log("hooks".blue + " has been added to this project");
        console.log("\n\n\tInterested in learning more about hooks?".yellow);
        console.log("\tCheckout this link:".yellow + " http://bit.ly/npm-for-git-hooks".blue + "\n\n");
    }
}


module.exports = main;