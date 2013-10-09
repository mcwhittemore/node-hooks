var colors = require("colors");

var main = function(args) {
    //this is horible. Need to look into modules to help with this.
    console.log("This `HELP` command is just a wrapper for now. But the docs are rather flushed out.".red);
    console.log("\thttps://github.com/mcwhittemore/node-hooks/blob/master/readme.md".blue);
    console.log("Interested in learning more about hooks?".yellow);
    console.log("Maybe you'd like to contribute to this sad help command?".yellow);
    console.log("\tCheckout this link:".yellow + " http://bit.ly/npm-for-git-hooks".blue + "\n\n");
}

module.exports = main;