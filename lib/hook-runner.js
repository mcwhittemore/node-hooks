var fs = require("fs");

var hook = "{hook-to-run}"; //this will be replaced when installed in the hook folder
var hookArgs = process.argv.slice(2); //these are the args passed to the git-hook file

//abstraction of the spawn command.
var spawn = function(command, args) {

    args = args || [];

    //setup spawn args
    args = args.concat(["run", hook]);
    args = args.concat(hookArgs);

    //start the child process
    var hooks = require("child_process").spawn(command, args);

    //write add stderr to stderr
    hooks.stderr.on("data", function(data) {
        process.stderr.write(data);
    });

    //write all stdout to stdout
    hooks.stdout.on("data", function(data) {
        process.stdout.write(data);
    });


    //on error, log an error
    hooks.on("error", function() {
        console.error("error", arguments);
    })

    //on close, close this file too
    hooks.on("close", function(code) {
        process.exit(code);
    });
}

//use the locally installed version of hooks if it exists
if (fs.existsSync("./node_modules/.bin/hooks")) {
    spawn("./node_modules/.bin/hooks");
} else {
    var packPath = process.cwd() + "/package.json";
    if (fs.existsSync(packPath)) { //if this folder has a package.json, check if it is node hooks
        var pack = require(packPath);
        if (pack.name == "node-hooks" && fs.existsSync(process.cwd() + "/bin/hooks.js")) {
            //if the current project is node-hooks, run the file in /bin/
            spawn("node", [process.cwd() + "/bin/hooks.js"]);
        } else {
            //use the globally installed version
            spawn("hooks");
        }
    } else {
        //use the globally installed version
        spawn("hooks");
    }
}