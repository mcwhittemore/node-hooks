# Building Hook Modules

Hook modules are passed at least one argument. Since Node.js modules are automatically passed two arguments, if you are writing your hook module in node this argument is at position two.

Some git-hooks also pass around their own arguments. If the hook that is being run is one of these the arguments will be passed after the hook argument. If you are unsure what the arguments your hook are being passed mean, [check out this overview](https://www.kernel.org/pub/software/scm/git/docs/githooks.html).

One of the powers of git hooks is being able to stop the git process if something seems wrong. To do that with hooks, send an exit code of 1.

## Example: Node.js

**index.js**

```
//define what hooks your module is valid for.
var validHooks = ["post-checkout", "pre-commit"];

//get the hook that is being run
var hook = process.argv[2];

//get the args git is passing to the hook
var args = process.argv.splice(3);

//don't your your code if you don't want it to work with other hooks.
if(validHooks.indexOf(hook)==-1){
	console.log("This hook module is not valid for "+hook+" so its not running");
}
else if(hook=="post-checkout"){
	console.log("Did you forget your receipt?");
	console.log("Try these:", args);
}
else{
	console.log("Thanks for running "+hook+". Currently this is not implemented.");
	process.exit(1);
}
```

**package.json**

```
{
	"name": "example-hook-module.hook",
	"version": "0.0.0",
	"description": "a hook that won't let you commit, and prints hook data for a checkout",
	"hook-module": {
	    "script-type": "node",
	    "valid-for": [
	      "pre-commit",
	      "post-checkout"
	    ]
	 }
}
```