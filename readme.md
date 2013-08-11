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
4. hooks init //sets up the hooks and installs defaults
5. hooks add new-hook
11. hooks remove unwanted-default-hooks

## Help

### hooks init

Installs hooks into the current project and seeds the project.json file if needed via npm init. 

#### Options

* --add-defaults: Adds the defaults

### hooks add

Adds an npm module to the local hooks project if the `hook module's` package.json fits the `hook-module specification` below. By default the module will be added to the hook specified in the module's package.json "default-hook" parameter and to the project's package.json devDependencies parameter.

#### Options

* --default, -d, --global, -g: Adds the module to the default hooks setup
* --hook: used -hook=[GIT HOOK NAME], this option overrides the hook-module's default-hook parameter.
* -f, --force: installs a module from npm even if it doesn't meet the `hooks-module specification`. Requires the --hook option
* --depend: adds the module to the project's package.json dependencies parameter.

### hooks remove

Removes a `hook-module` from the project and from the project's package.json devDependencies parameter.

#### Options

* --safe: only remove the `hook-module` from the hooks parameter of the project's pacakge.json file. This means `npm` will still install the module but it won't be run via hooks.
* --hard: Also removes the module from the project's dependencies parameter.
* --default, -d, -global, -g: removes the `hooks-module` from `default hooks`.

### hooks run

Runs a hook.

### hooks list

Lists the module hooks as they are currently set up in the active project

#### Options

* --default, -d, -global, -g: Lists the module hooks as they are currently setup in the defaults folder.

### hooks create

Seeds a folder for a new `hook-module`. Simular to `npm init`
