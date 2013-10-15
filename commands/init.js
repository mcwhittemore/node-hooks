var fs = require("fs");
var installer = require("npm-installer");
var exec = require("child_process").exec;
var colors = require("colors");


/** ================================== FILE PATHS ================================== **/

var packageJsonFile = process.cwd() + "/package.json";
var hooksJsonFile = process.cwd() + "/hooks.json";

/** ================================================================================ **/

var main = function(args) {

    //setting up options. this should be moved to a module for this.
    var options = {};
    options.soft = args.indexOf("--soft") == -1 ? false : true;
    options.bare = args.indexOf("--bare") == -1 ? false : true;
    options.hasHooksJson = hasHooksJson();
    options.hasPackageJson = hasPackageJson();

    //is valid git folder
    if (hasGit(options.bare)) {

        //build out required files 
        create(options);

        if (process.env.SKIP_INSTALL == undefined) { //this is here to provide a way for test to skip this install

            //thing to all tests to override this install
            var moduleToInstall = process.env.HOOKS_TEST_INSTALL || "node-hooks";

            installer(moduleToInstall, function(err, result) {
                if (err) {
                    console.error("HOOKS: ".blue + " Error adding node-hooks to the node_modules folder".red);
                } else if (options.soft) {
                    console.log("HOOKS: ".blue + " Added to node-modules, but not saved to the devDependencies");
                } else {
                    var packageJson = require(packageJsonFile);
                    packageJson.devDependencies = packageJson.devDependencies || {};
                    packageJson.devDependencies["node-hooks"] = result.version;

                    saveJson(packageJsonFile, packageJson, function() {
                        console.log("HOOKS: ".blue + " Added to the devDependencies");
                    });
                }
            });
        }
    } else {
        console.log("ERROR:".red + " hooks depends on " + "git".yellow);
        var bare = options.bare ? " --bare" : "";
        console.log("       Please run " + ("`git init" + bare + "`").yellow + " before " + "`hooks install`".yellow);
        process.exit(1);
    }
}


/** ================================================================================ **/

//NOTE: this function is part of a multi function recurse
var create = function(options) {
    //build package.json
    if (!options.hasPackageJson) {
        createPackageJson(options);
        //build hooks.json
    } else if (!options.hasHooksJson) {
        createHooksJson(options);
    } else {
        //create the ./git/hooks files
        createHooks(options);
    }
}

//if the cwd doesn't have a package.json file start creating one.
var createPackageJson = function(options) {
    var packageJson = {
        name: "default"
    }

    saveJson(packageJsonFile, packageJson, function() {
        options.hasPackageJson = true;
        create(options);
    });

}

//if the cwd doesn't have a hooks.json file start creating one.
var createHooksJson = function(options) {
    var defaultHooksJson = {};

    saveJson(hooksJsonFile, defaultHooksJson, function() {
        options.hasHooksJson = true;
        create(options);
    });
}

//create the .git/hooks files
var createHooks = function(options) {

    //load up hook-runner.sh
    //NOTE: this is JS. the .sh on this file is just because its got a #!/usr/bin/env node
    var baseContent = fs.readFileSync(__dirname + "/../lib/hook-runner.js", {
        encoding: "utf8"
    });

    baseContent = "#!/usr/bin/env node\n" + baseContent;

    //load all the possible hook files
    var possibleHooks = require("../lib/possible-hooks");
    var numHooks = possibleHooks.length;

    //create file path to hooks directory
    var filePath = options.bare == true ? "./hooks/" : "./.git/hooks/";

    while (numHooks--) {
        var hook = possibleHooks[numHooks];

        var fileName = filePath + hook;

        //archive current hooks if it needs to be saved
        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, fileName + ".old");
        }

        var content = baseContent.replace("{hook-to-run}", hook);

        //create exicutable file
        createFile(fileName, content, true);
    }
}

/** ================================== CHECKERS ================================== **/


var hasGit = function(bare) {
    if (!bare) {
        //if were not bare, git should be in .git
        return fs.existsSync(".git") && hasHooksFolder(bare);
    } else {
        //if we are bare, the hooks folder is all that matter
        return hasHooksFolder(bare);
    }
}

var hasHooksFolder = function(bare) {
    if (bare) {
        //if we're bare the folder should be on the same level
        return fs.existsSync("hooks");
    } else {
        //if we're not bare it should be hidden it .git
        return fs.existsSync(".git/hooks");
    }
}

var hasHooksJson = function() {
    return fs.existsSync(hooksJsonFile);
}

var hasPackageJson = function() {
    return fs.existsSync(packageJsonFile);
}

/** ============================================================================== **/

var saveJson = function(file, json, callback) {
    var jsonString = JSON.stringify(json, null, 2) + '\n';
    createFile(file, jsonString, false, callback);
}

//used to create files, complex so it can created exicutable files
var createFile = function(fileName, content, chmodX, callback) {
    var fileMade = function(err) {
        if (err) {
            console.error("`" + fileName + "` could not be created", err);
            process.exit(1);
        } else if (chmodX === true) {
            exec("chmod a+x " + fileName, chmodDone);
        } else {
            callback();
        }
    }

    var chmodDone = function(err, stdout, stderr) {
        if (err) {
            console.error("`" + fileName + "` could not be created", err, stderr);
            process.exit(1);
        } else if (callback != undefined) {
            callback();
        }
    }

    fs.writeFile(fileName, content, fileMade);
}

module.exports = main;