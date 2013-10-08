module.exports = function(module, callback) {
    var npm = require("npm");
    var npmconf = require("npmconf");
    var configDefs = npmconf.defs;
    var shorthands = configDefs.shorthands;
    var types = configDefs.types;
    var nopt = require("nopt");
    var conf = nopt(types, shorthands);

    var dataToResult = function(data) {
        var result = {};
        result.module_and_version = data[0];
        result.module = data[0].split("@")[0];
        result.version = data[0].split("@")[1];
        result.location = data[1];
        result.parent = data[2];
        result.parentLocation = data[3];
        result.origin = data[4];
        return result;
    }

    npm.load(conf, function(er) {
        if (er) {
            console.log("LOAD ERR", er);
        } else {
            npm.commands["install"]([module], function(err, data) {
                if (err) {
                    callback(err);
                } else if (data.length == 0) {
                    callback("no data");
                } else {
                    var result = dataToResult(data[data.length - 1]);
                    result.children = [];
                    for (var i = 0; i < data.length - 2; i++) {
                        result.children.push(dataToResult(data[i]));
                    }

                    callback(null, result);
                }
            });
        }
    });
}