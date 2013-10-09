#!/usr/bin/env node
;(function() {
    process.title = "hooks";

    //available external commands
    var commands = [
        "help",
        "install",
        "uninstall",
        "run",
        "add",
        "remove",
        "list",
        "--version",
        "-v"
    ]

    //vanity commands routed to real commands
    var vanity_routes = {
        "--version": "version",
        "-v": "version"
    }

    //split off default node args
    var args = process.argv.slice(2);

    //if nothing was provided run help
    if (args.length == 0) {
        require("../commands/help")();
    }
    //run command if it is in the commands array
    else if (commands.indexOf(args[0]) != -1) {
        var command = vanity_routes[args[0]] || args[0];
        require("../commands/" + command)(args.slice(1));
    }
    //else show help
    else {
        console.error("`" + args[0] + "` is not a valid command");
        require("../commands/help")(args);
    }

})();