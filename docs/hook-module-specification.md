# Hook Module Specification

This document aims to answer three questions.

1. What makes an `npm-module` a `hook-module`?
2. How do I get my module to commuicate with the git hook process?
3. Does my module have to be written in node?

If you are looking for some insight on best practices please look here.

Like all of `hooks` this document is a work in progress. Please feel free to fork and improve.

## Question 1: What makes an `npm-module` a `hook-module`?

It has a key on its `package.json` called hook-module. That key is paired with an object like this.

```json
{
	"default-hook": "pre-commit",
	"script-type": "node"
}
```

### Sub-Question 1: Is `default-hook` required?

Yes. Though users can override it on `hook add` via the `--hook=` option.

### Sub-Question 2: Is `script-type` required?

Nope. If it is not provided the value will default to `node`.

### Sub-Question 3: What other `script-types` can I use?

Please see `Question 3`.

## Question 2: How do I get my module to commuicate with the git hook process?

Exit codes. A zero means success, a one or more means failure.

### Sub-Question 1: How do I set the exit code in node.

```
process.exit(1); //failed the hook
```

## Question 3: Does my module have to be written in node?

Nope.