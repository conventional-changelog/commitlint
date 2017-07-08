> Lint your commits, angular-style

# @commitlint/config-lerna-scopes
Shareable `commitlint` config enforcing lerna package names as scopes.

## Installation

```shell
npm install --save-dev @commitlint/config-lerna-scopes @commitlint/cli
```

## Usage
Install and use as `commitlint` shareable config.
```js
// .commitlintrc
{
  "extends": ["angular", "lerna-scopes"]
}
```

## Examples

```
❯ cat .commitlintrc
{
  "extends": ["lerna-scopes"]
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

---
⇨ See [commitlint/shareable-config](/marionebl/commitlint/documentation/shareable-config.md) for details

---
Copyright (c) by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
