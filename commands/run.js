var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require("child_process").spawn;
var colors = require("colors");

var rootFolder = process.cwd();

var main = function(args) {

    var hook = args[0];

    var hooks = require("../lib/possible-hooks");

    if (hooks.indexOf(hook) == -1) {
        console.error(hook.blue + " is not a valid git-hook".red);
        process.exit(1);
    }

    fs.readFile("hooks.json", function(err, data) {

        if (err) {
            console.error("ERROR READING `hooks.json`".red);
            console.log(">> " + "Has hooks been merged into this branch?".blue);
            process.exit(0);
        } else {
            var options;

            try {
                options = JSON.parse(data);
            } catch (err) {
                console.error("ERROR PARSING `hooks.json`".red, err);
                process.exit(1);
            }

            if (options[hook] != undefined) {
                queue(args, Object.keys(options[hook]), options[hook]);
            }
        }

    });
}

var queue = function(args, keys, commands) {

    var key = keys[0];

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

var open = function(args, name, path, callback) {
    var folder = "node_modules/" + name;
    fs.readFile(folder + "/package.json", function(err, data) {
        if (err) {
            fs.readFile(path + "/package.json", function(err, data) {
                if (err) {
                    callback("CANNOT FIND `", name, "`");
                } else {
                    prep(args, data, path, callback);
                }
            });
        } else {
            prep(args, data, folder, callback);
        }
    });
}

var prep = function(args, data, folder, callback) {
    var options = undefined;

    try {
        options = JSON.parse(data);
    } catch (err) {
        callback(err);
    }

    if (options) {
        var file = options["main"] || "index.js";
        var type = options["hook-module"] != undefined ? options["hook-module"]["script-type"] || "node" : "node";

        enact(args, type, folder + "/" + file, callback);
    }
}

var enact = function(args, type, file, callback) {


    var command = type == "shell" ? file : type;

    var commandArgs = [];
    if (command != file) {
        commandArgs.push(file);
    }

    commandArgs = commandArgs.concat(args);

    var hook = spawn(command, commandArgs);

    hook.stdin.on("data", function(data) {
        process.stdin.write(data);
        console.log("woot");
    });

    hook.stderr.on("data", function(data) {
        process.stderr.write(data);
    });

    hook.stdout.on("data", function(data) {
        process.stdout.write(data);
    });

    hook.on("error", function(err) {
        console.error("HOOKS:", err.message);
    })

    hook.on("close", function(code) {
        callback(undefined, code);
    });

}

module.exports = main;
