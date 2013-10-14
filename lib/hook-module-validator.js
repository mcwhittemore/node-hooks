//validates the json provided meets hook-module standards.
module.exports = function(json, callback) {

    var possibleHooks = require("../lib/possible-hooks");

    if (json["hook-module"] == undefined) {
        callback("hook-module must be defined");
    } else if (json["hook-module"]["script-type"] == undefined) {
        callback("script-type must be defined");
    } else if (json["hook-module"]["valid-for"] == undefined) {
        callback("valid-for must be defined");
    } else { //has all required attributes

        //convert string version of valid-for to array
        if (typeof json["hook-module"]["valid-for"] == "string") {
            json["hook-module"]["valid-for"] = [json["hook-module"]["valid-for"]];
        }

        //if valid-for is not an array, error
        if (Object.prototype.toString.call(json["hook-module"]["valid-for"]) != '[object Array]') {
            callback("valid-for must be a string or an array");
        } else if (json["hook-module"]["valid-for"].length != 0) {
            //confirm valid for only has valid git-hooks
            var allValids = true;

            for (var i = 0; i < json["hook-module"]["valid-for"].length; i++) {
                if (possibleHooks.indexOf(json["hook-module"]["valid-for"][i]) == -1) {
                    allValids = json["hook-module"]["valid-for"][i];
                    break;
                }
            }

            if (allValids === true) {
                callback(null, "looks good");
            } else {
                callback(allValids + " is not a valid git-hook");
            }
        } else {
            callback("valid-for must have at least one git-hook");
        }
    }
}