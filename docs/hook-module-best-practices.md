# Hook Module Best Practices

Please fork this file and add as many tips as you can think of. Code samples would be great.

## Always write tests.

## Limit exit codes to 0 and 1.

## Statsh unchecked in code before commit hooks.

## Remember that the arguments your script is passed contains the git-hook that is enacting it.

For node:

```javascript
var hook = process.argv[2];
```

