# Hooks

An [NPM](https://github.com/isaacs/npm) for git hooks.

## Terms

* `hook-module`: Any module in npm that meets the `hook-module specification`. 
* `hook-module specification`: A set of guidelines that define what it means to be a `hook-module`. [View here.](https://github.com/mcwhittemore/node-hooks/blob/master/docs/hook-module-specification.md)
* `npm`: node package manager. This can be (and is) used for more things than node modules.
* `npm-module`: a bit of code that can be downloaded via npm.
* `package.json`: a required file for `npm-modules` defined [here](https://github.com/isaacs/npm/blob/master/doc/files/package.json.md).

## Setup

```
npm install -g node-hooks
```

## Use

```
git init
hooks install
hooks add new-hook
```

## Available Hooks on NPM

* pull-checkout-merge-command.hook: Run scripts after certain git commands are used. Great for compiled source mangeagement between branches and automating magrations.

## How to write a git hooks for `Hooks`

The [hook-module sepcs](https://github.com/mcwhittemore/node-hooks/blob/master/docs/hook-module-specification.md) should cover some of the basics while the [hook-module best practices](https://github.com/mcwhittemore/node-hooks/blob/master/docs/hook-module-best-practices.md) doc will help you avoid trip ups.

## Is there a way to search npm for hook-modules only?

Working on that. See the TODO list below.

## Commands

### hooks install

Installs hooks into the current working directory, seeding the required hooks.json and package.json files if needed.

It will also add node-hooks to the projects project.json devDependencies and node_modules folder so that all developers on the project will use the same hooks even if they don't have node-hooks installed locally.

#### Options

* --soft: stops install from adding hooks to the package.json devDependencies and node_modules.
* --bare: updates folder dependency checks to reflect that of a git --bare repo.

### hooks uninstall

Uninstall hooks from the current working directory. Removes hooks.json, but does not touch package.json or the node_module directory.

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
1. Add `hooks skip hook-module` to skip globals

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

## Change Log

### 0.0.4

* Adding availabe hooks section to readme
* Starting change log

### 0.0.5

* Pass args on to hook-moduless
* Provide --bare command for install hooks into bare repos
