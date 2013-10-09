var fs = require("fs");
var colors = require("colors");

/** =============================== INTERNAL MODULES =============================== **/

var install = require("../lib/install-module");
var isValidHookModule = require("../lib/hook-module-validator");
var possibleHooks = require("../lib/possible-hooks");

/** ================================== FILE PATHS ================================== **/

var hooksJsonFile = process.cwd() + "/hooks.json";
var packageJsonFile = process.cwd() + "/package.json";

/** ================================================================================ **/

var main = function(args) {

    var opts = setupOptions(args);
    //if args passed create valid options and the hooks.json file exhists
    if (opts.valid && fs.existsSync(hooksJsonFile)) {
        install(opts.hook_module, function(success, node_module, module_version) {
            if (success) {
                var data = require("../lib/hook-module-package")(node_module);
                opts.name = node_module;
                opts.version = module_version;
                var localFile = process.cwd() + "/" + opts.hook_module;
                if (fs.existsSync(localFile)) {
                    opts.version = opts.hook_module;
                }
                if (!opts.force) {
                    postInstallDontForce(opts, data);
                } else {
                    addToFiles(opts);
                }
            }
        });
    }
    //if options are valid than the hooks.json file must be gone!
    else if (opts.valid) {
        console.log("No `hooks.json` file was found!".red);
        console.log("\tRun `hooks install` to add hooks to this folder".yellow);
    }
}

//this should be converted over to commands
var setupOptions = function(args) {

    //default options
    var opts = {
        name: undefined,
        version: undefined,
        force: false,
        global: false,
        hook: "default",
        depend: true,
        hook_module: args[args.length - 1],
        valid: true
    }

    //look through args
    for (var i = 0; i < args.length - 1; i++) {
        var arg = args[i];

        if (arg == "--hook") {
            opts.hook = args[i + 1];
            i++;
        } else if (arg == "-f" || arg == "--force") {
            opts.force = true;
        } else if (arg == "--soft") {
            opts.depend = false;
        } else {
            console.log(arg.red + " is not a valid argument on `hooks add`".yellow);
            opts.valid = false;
        }
    }

    //if user is forcing install, they must supply a git-hook.
    if (opts.hook == "default" && opts.force) {
        console.log("-f, -force requires -hook".red);
        opts.valid = false;
    }

    //validate hook
    if (opts.hook == undefined) {
        console.log("--hook must be followed by <HOOK_NAME>".red);
        opts.valid = false;
    } else if (opts.hook != "default" && possibleHooks.indexOf(opts.hook) == -1) {
        console.log(opts.hook.red + " is not a valid hook".yellow);
        opts.valid = false;
    }

    return opts;
}

var postInstallDontForce = function(opts, data) {
    //check if module is valid
    isValidHookModule(data.json, function(err, success) {
        if (err) {
            console.log(err.red);
            console.log(("`" + opts.hook_module + "`").red + " could not be added as it does not match the hook-module specification. If you want to override this be use the `-f` option.");
        }
        //add to all default git-hooks
        else if (opts.hook == "default") {
            var validFor = data.json["hook-module"]["valid-for"];
            var valids = typeof validFor == "string" ? [validFor] : validFor;

            for (var i = 0; i < valids.length; i++) {
                opts.hook = valids[i];
                addToFiles(opts);
            }
        }
        //add to a non-default git-hook
        else {
            addToFiles(opts);
        }
    });
}

var addToFiles = function(opts) {

    //if the version hasn't been found yet or the version passed is weird
    if (opts.version == undefined || opts.version.match(/\d\.\d\.\d/) == null) {
        //see if the version is on the hook-module used to start the install
        opts.version = opts.hook_module.split("@")[1];
    }

    //if the version still hasn't been found
    if (opts.version == undefined) {
        //assue the hook-module used to start the install is a url
        opts.version = opts.hook_module;
    }

    //if this is being added to the users global hooks.json
    if (opts.global) {
        //har har, thats funny.
    }
    //if the is being added to a projects hooks.json
    else {
        //if the user wants to add this the the packageJson devDependencies. DEFAULT.
        if (opts.depend) {

            //use require to load the package.json file.
            var packageJson = require(packageJsonFile);

            //create devDependencies if needed
            packageJson.devDependencies = packageJson.devDependencies == undefined ? {} : packageJson.devDependencies;

            packageJson.devDependencies[opts.name] = opts.version;
            saveJson(packageJsonFile, packageJson, false);
        }

        //use require to load the hooksJson
        var hooksJson = require(hooksJsonFile);

        //create git-hook named object if its not found
        hooksJson[opts.hook] = hooksJson[opts.hook] == undefined ? {} : hooksJson[opts.hook];

        hooksJson[opts.hook][opts.name] = opts.version;
        saveJson(hooksJsonFile, hooksJson, false);
    }
}

var saveJson = function(file, json, global) {
    //turn json into something we can write to a readable file.
    var content = JSON.stringify(json, null, 2) + '\n';
    try {
        fs.writeFileSync(file, content);
    } catch (err) {
        if (err && err.code == "EACCES") {
            console.log("FILE PERMISSION ERROR".red + " The current user does not have access to write to " + file);
        } else if (err) {
            console.log("ERROR: ".red + "saveing " + file);
        }
    }
}

/** ================================================================================ **/

module.exports = main;