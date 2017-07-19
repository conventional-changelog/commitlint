> Lint your commits, angular-style

# @commitlint/config-lerna-scopes
Shareable `commitlint` config enforcing lerna package names as scopes.
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

## Getting started

```
npm install --save-dev @commitlint/config-lerna-scopes @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-lerna-scopes']};" > commitlint.config.js
```

## Examples

```
❯ cat commitlint.config.js
{
  extends: ['@commitlint/config-lerna-scopes']
}

❯ tree packages

packages
├── api
├── app
└── web

❯ echo "chore(api): fix something in api's build" | commitlint
⧗   input: chore(api): fix something in api's build
✔   found 0 problems, 0 warnings

❯ echo "chore(foo): this won't pass" | commitlint
⧗   input: chore(foo): this won't pass
✖   scope must be one of [api, app, web] [scope-enum]
✖   found 1 problems, 0 warnings

❯ echo "chore: do some general maintenance" | commitlint
⧗   input: chore: do some general maintenance
✔   found 0 problems, 0 warnings
```

Consult [docs/rules](http://marionebl.github.io/commitlint/#/reference-rules) for a list of available rules.
