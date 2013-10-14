var npmSource = "http://registry.npmjs.org/node-hooks/-/node-hooks-0.0.13.tgz";
var destination = __dirname + "/extract";

var tar = require('tar');

var zlib = require('zlib');

var request = require("request");


request(npmSource).pipe(zlib.createGunzip()).pipe(tar.Extract({
    path: destination
})).on('end', function() {
    console.log("FILE DOWNLOADED AND EXTRACTED");
});