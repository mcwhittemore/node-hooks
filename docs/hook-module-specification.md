# Hook Module Specification

This document aims to answer three questions.

1. What makes an `npm-module` a `hook-module`?
2. How do I get my module to communicate with the git hook process?
3. Does my module have to be written in node?

If you are looking for some insight on best practices please look here.

Like all of `hooks` this document is a work in progress. Please feel free to fork and improve.

## Question 1: What makes an `npm-module` a `hook-module`?

It has a key on its `package.json` called hook-module. That key is paired with an object like this.

```json
{
	"script-type": "node",
	"valid-for": ["pre-commit", "post-update"]
}

OR

{
	"script-type": "node",
	"valid-for": "pre-commit"
}
```

### Sub-Question 1: Is `valid-for` required?

Yes. This is what tell hooks what to run and when.

### Sub-Question 2: Is `script-type` required?

Yes.

### Sub-Question 4: What other `script-types` can I use?

Please see `Question 3`.

## Question 2: How do I get my module to communicate with the git hook process?

Exit codes. A zero means success, a one means failure. Any number higher than one also means failure, but in time these codes might used for more complex means, so please refrain for now. 

### Sub-Question 1: How do I set the exit code in node.

```
process.exit(1); //failed the hook
```

## Question 3: Does my module have to be written in node?

Nope. Just provide the common command line name for the scripting language and all will be well.

For example, `python` should be provided if your hook script has been written in python and `shell` should be provided if your hook is a shell script.
