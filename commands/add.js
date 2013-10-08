var fs = require("fs");
var colors = require("colors");
var install = require("../lib/install-module");

var isValidHookModule = require("../lib/hook-module-validator");

/** ================================================================================ **/

var hooksJsonPath = process.cwd() + "/hooks.json";

/** ================================================================================ **/

var main = function(args) {


    var opts = setupOptions(args);
    if (opts.valid) {
        if (hasHooksJson() && !opts.global) {
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
                        isValidHookModule(data.json, function(err, success) {
                            if (err) {
                                console.log(err.red);
                                console.log(("`" + opts.hook_module + "`").red + " could not be added as it does not match the hook-module specification. If you want to override this be use the `-f` option.");
                            } else if (opts.hook == "default") {
                                var valids = [];

                                if (typeof data.json["hook-module"]["valid-for"] == "string") {
                                    valids.push(data.json["hook-module"]["valid-for"]);
                                } else {
                                    valids = data.json["hook-module"]["valid-for"];
                                }

                                for (var i = 0; i < valids.length; i++) {
                                    opts.hook = valids[i];
                                    addToFiles(opts);
                                }
                            } else {
                                addToFiles(opts);
                            }
                        });
                    } else {
                        addToFiles(opts);
                    }
                }
            });
        } else if (opts.global) {
            console.log("This needs to be thought out better".yellow + " Look for it in a future release");
            //addToFiles(opts);
        } else {
            console.log("No `hooks.json` file was found!".red);
            console.log("\tRun `hooks install` to add hooks to this folder".yellow);
        }
    }

}

/** ================================================================================ **/

var hasHooksJson = function() {
    return fs.existsSync(hooksJsonPath);
}


var setupOptions = function(args) {
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

    for (var i = 0; i < args.length - 1; i++) {
        var arg = args[i];

        if (arg == "--default" || arg == "-d" || arg == "--global" || arg == "-g") {
            opts.global = true;
        } else if (arg == "--hook") {
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

    if (opts.hook == "default" && opts.force) {
        console.log("-f, -force requires -hook".red);
        opts.valid = false;
    }

    if (opts.hook == undefined) {
        console.log("--hook must be followed by <HOOK_NAME>".red);
        opts.valid = false;
    } else if (opts.hook != "default") {
        var possible_hooks = require("../lib/possible-hooks");
        if (possible_hooks.indexOf(opts.hook) == -1) {
            console.log(opts.hook.red + " is not a valid hook".yellow);
            opts.valid = false;
        }
    } else if (opts.global && opts.depend) {
        console.log("--default and --depend cannot be used together".red);
        opts.valid = false;
    }

    return opts;
}

var addToFiles = function(opts) {

    if (opts.version == undefined || opts.version.match(/\d\.\d\.\d/) == null) {
        opts.version = opts.hook_module.split("@")[1];
    }

    if (opts.version == undefined) {
        //fall back is url
        opts.version = opts.hook_module;
    }

    if (opts.global) {
        // var defaults = require("../lib/default-modules");
        // defaults.json.hooks[opts.hook][opts.name] = opts.version;
        // defaults.save(function(err){
        // 	if(err){
        // 		console.log("hooks add failed".yellow);
        // 	}
        // });
    } else {

        if (opts.depend) {
            var packageJsonFile = process.cwd() + "/package.json";
            var packageJson = require(packageJsonFile);
            packageJson.devDependencies = packageJson.devDependencies == undefined ? {} : packageJson.devDependencies;
            packageJson.devDependencies[opts.name] = opts.version;
            saveJson(packageJsonFile, packageJson, false);
        }

        var hooksJsonFile = process.cwd() + "/hooks.json";
        var hooksJson = require(hooksJsonFile);
        if (hooksJson[opts.hook] == undefined) {
            hooksJson[opts.hook] = {};
        }
        hooksJson[opts.hook][opts.name] = opts.version;
        saveJson(hooksJsonFile, hooksJson, false);
    }
}

var saveJson = function(file, json, global) {
    var content = JSON.stringify(json, null, 2) + '\n';
    try {
        fs.writeFileSync(file, content);
    } catch (err) {
        if (err && err.code == "EACCES") {
            console.log("FILE PERMISSION ERROR".red + " The current user does not have access to write to " + file);
            if (global) {
                console.log("Default hook setup often requires admin access".yellow);
            }
        } else if (err) {
            console.log("ERROR: ".red + "saveing " + file);
        }
    }
}

/** ================================================================================ **/

module.exports = main;