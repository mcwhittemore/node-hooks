var fs = require("fs");
var colors = require("colors");

var main = function(args) {
    var hooks = require("../lib/possible-hooks");
    var numHooks = hooks.length;

    //do the below actions for each possible git-hook
    while (numHooks--) {
        var hook = hooks[numHooks];

        var fileName = "./.git/hooks/" + hook;

        var action = 0;

        //if the git-hook file is, remove it
        if (fs.existsSync(fileName)) {
            //remove current
            fs.unlinkSync(fileName);
            action++; //track actions taken to report correctly at the end.
        }

        //if there is an archived git-hook move it!
        if (fs.existsSync(fileName + ".old")) {
            //move old back in
            fs.renameSync(fileName + ".old", fileName);
            action += 2; //track actions taken to report correctly at the end.
        }

        //inform the console on what's been going on
        //this is bassed on the numeric representation of chmod.
        //the addition done above, will result in unique ids, that now get logged
        if (action == 1) {
            console.log(hook.blue + " has been removed");
        } else if (action == 2) {
            console.log(hook.blue + " has been restored to its archived version");
        } else if (action == 3) {
            console.log(hook.blue + " has been replaced with its archived version");
        }
    }

    //remove the hooks.json file
    if (fs.existsSync("hooks.json")) {
        fs.unlinkSync("hooks.json");
        console.log("hooks.json".blue + " has been removed");
    }
}

module.exports = main;