var fs = require("fs");
var spawn = require("child_process").spawn;
var colors = require("colors");

var rootFolder = process.cwd();

var main = function(args) {

    //get the hook we need to run
    var hook = args[0];

    //get a list of valid hooks
    var hooks = require("../lib/possible-hooks");

    //make sure the hook we're going to run is valid
    if (hooks.indexOf(hook) == -1) {
        console.error(hook.blue + " is not a valid git-hook".red);
        process.exit(1);
    }

    //open the hooks.json file that is a sibling of the .git folder
    fs.readFile("hooks.json", function(err, data) {

        if (err) {
            console.error("ERROR READING `hooks.json`".red);
            console.log(">> " + "Has hooks been merged into this branch?".blue);
            process.exit(0);
        } else {
            var options;

            //parse it
            try {
                options = JSON.parse(data);
            } catch (err) {
                console.error("ERROR PARSING `hooks.json`".red, err);
                process.exit(1);
            }

            //if there are hook-modules on the hook requested start processing
            if (options[hook] != undefined) {
                queue(args, Object.keys(options[hook]), options[hook]);
            }
        }

    });
}

//an async recursive loop walking through keys
var queue = function(args, keys, commands) {

    //get key at the top of the queue
    var key = keys[0];

    //open key, split off current key, recurse if there are more keys
    open(args, key, commands[key], function(err, exit_code) {
        if (err) {
            console.error("ERROR ENACTING `", key, "`", err);
            process.exit(1);
        } else if (exit_code != 0) {
            process.exit(exit_code);
        }

        keys = keys.slice(1);

        if (keys.length == 0) {
            process.exit(0);
        } else {
            queue(args, keys, commands);
        }
    });
}

//find node_module and 
var open = function(args, name, path, callback) {
    //first assume hook-module is in node_modules
    var folder = "node_modules/" + name;
    fs.readFile(folder + "/package.json", function(err, data) {
        if (err) {
            //if its not in node_modules, assue its local and can be found with path/version arg
            fs.readFile(path + "/package.json", function(err, data) {
                if (err) {
                    callback("CANNOT FIND `", name, "`");
                } else {
                    //get ready to run
                    prep(args, data, path, callback);
                }
            });
        } else {
            //get ready to run
            prep(args, data, folder, callback);
        }
    });
}

var prep = function(args, data, folder, callback) {
    var options = undefined;

    //parse the package.json file of the hook-module
    try {
        options = JSON.parse(data);
    } catch (err) {
        callback(err);
    }

    if (options) {
        //get file name
        var file = options["main"] || "index.js";
        //get script type
        var type = options["hook-module"] != undefined ? options["hook-module"]["script-type"] || "node" : "node";

        //run script
        enact(args, type, folder + "/" + file, callback);
    }
}

var enact = function(args, type, file, callback) {

    //is this a shell command or some other scripting language?
    var command = type == "shell" ? file : type;

    //prep for spawn
    var commandArgs = [];
    //if command is not shell, add file to list of args to be sent to spawn
    if (command != file) {
        commandArgs.push(file);
    }

    //add args passed to hooks run into the args for spawn
    commandArgs = commandArgs.concat(args);

    //start the spawn
    var hook = spawn(command, commandArgs);

    //write all data from stdin to stdin
    hook.stdin.on("data", function(data) {
        process.stdin.write(data);
        console.log("woot");
    });

    //write all data from stderr to stderr
    hook.stderr.on("data", function(data) {
        process.stderr.write(data);
    });

    //write all data from stdout to stdout
    hook.stdout.on("data", function(data) {
        process.stdout.write(data);
    });

    //log errors
    hook.on("error", function(err) {
        console.error("HOOKS:", err.message);
    })

    //sync back to callback provided in open on close
    hook.on("close", function(code) {
        callback(undefined, code);
    });

}

module.exports = main;