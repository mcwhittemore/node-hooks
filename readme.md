# Hooks

An [NPM](https://github.com/isaacs/npm) for git hooks

## Terms

* `hook-module`: Any module in npm that meets the `hook-module specification`. 
* `hook-module specification`: A set of guidelines that define what it means to be a `hook-module`. [View here.](https://github.com/mcwhittemore/node-hooks/blob/master/docs/hook-module-specification.md)
* `default hooks`: `hook-modules` that are added to a project on `hook init`.
* `npm`: node package manager. This can be (and is) used for more things than node modules.
* `npm-module`: a bit of code that can be downloaded via npm.
* `package.json`: a required file for `npm-modules` defined [here](https://github.com/isaacs/npm/blob/master/doc/files/package.json.md).


## Workflow

This is just an example workflow for install and using hooks.

1. npm install -g node-hooks
2. cd ./project-folder
3. git init
4. hooks install //sets up the hooks and installs defaults
5. hooks add new-hook
6. hooks remove unwanted-default-hooks

## Help

### hooks install

Installs hooks into the current working directory and seeds the hooks.json and package.json file if needed.

### hooks uninstall

Uninstall hooks from the current working directory. Removes hooks.json, but does not touch package.json.

### hooks add {hook-module} [options]

Adds an npm module to the local hooks project if the `hook module's` package.json fits the `hook-module specification` below. By default the module will be added to the hook specified in the module's package.json "default-hook" parameter and to the project's package.json devDependencies parameter.

#### Options

* --hook {GIT HOOK NAME}: this option overrides the hook-module's default-hook parameter.
* -f, --force: installs a module from npm even if it doesn't meet the `hooks-module specification`. Requires the --hook option
* --soft: don't add the module to the package.json

### hooks remove {hook-module} [options]

Removes a `hook-module` from the default hooks.

#### Options

* --hook {GIT HOOK NAME}: remove module from specified git hook.
* --all-hooks: remove the module from all git hooks
* --hard: Also removes the module from the project's devDependencies parameter.

### hooks run {git-hook}

Runs a hook.

## To Do

1. Rework globals
	* ~/.hooks/global: hooks a user wants to run for all their projects
5. Add `hooks skip hook-module` to skip globals

## Upcoming Commands

### globals

* hooks install --global
* hooks uninstall --global
* hooks add --global
* hooks remove --global
* hooks run --global

### hooks skip {hook-module} [options]

Remove a modules from the project (hooks remove --all-hooks) and forces a skip if its installed on a global level

#### Options

* --hook {GIT HOOK NAME}: remove module from specified git hook.
* --all-hooks: remove the module from all git hooks

### hooks list [options]

Lists the module hooks as they are currently set up in the active project

#### Options

* --global: Lists the module hooks as they are currently setup in the defaults folder.

### hooks search key words

does an npm search for modules tagged git-hooks
