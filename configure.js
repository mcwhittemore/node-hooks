//stops install/uninstall command if on a global run
if(process.env.npm_config_global!=="true"){
	require("./commands/"+process.argv[2])([]);
}