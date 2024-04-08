# @commitlint/config-lerna-scopes

Lint your lerna project commits

Shareable `commitlint` config enforcing lerna package and workspace names as scopes.
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

## Getting started

```sh
npm install --save-dev @commitlint/config-lerna-scopes @commitlint/cli
echo "export default {extends: ['@commitlint/config-lerna-scopes']};" > commitlint.config.js
```

## Examples

```text
❯ cat commitlint.config.js
{
  extends: ['@commitlint/config-lerna-scopes']
}

❯ tree packages

packages
├── api
├── app
└── web

❯ echo "build(api): change something in api's build" | commitlint
⧗   input: build(api): change something in api's build
✔   found 0 problems, 0 warnings

❯ echo "test(foo): this won't pass" | commitlint
⧗   input: test(foo): this won't pass
✖   scope must be one of [api, app, web] [scope-enum]
✖   found 1 problems, 0 warnings

❯ echo "ci: do some general maintenance" | commitlint
⧗   input: ci: do some general maintenance
✔   found 0 problems, 0 warnings
```

Consult [Rules reference](https://commitlint.js.org/reference/rules) for a list of available rules.
