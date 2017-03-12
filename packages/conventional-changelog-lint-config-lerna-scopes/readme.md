> Lint your commits, angular-style

# conventional-changelog-lint-config-lerna-scopes
Shareable `conventional-changelog-lint` config enforcing lerna package names as scopes.

## Installation

```shell
npm install --save-dev conventional-changelog-lint-config-lerna-scopes conventional-changelog-lint
```

## Usage
Install and use as `conventional-changelog-lint` shareable config.
```js
// .conventional-changelog-lintrc
{
  "extends": ["angular", "lerna-scopes"]
}
```

## Examples

```
❯ cat .conventional-changelog-lintrc
{
  "extends": ["lerna-scopes"]
}

❯ tree packages

packages
├── api
├── app
└── web

❯ echo "chore(api): fix something in api's build" | conventional-changelog-lint
⧗   input: chore(api): fix something in api's build
✔   found 0 problems, 0 warnings

❯ echo "chore(foo): this won't pass" | conventional-changelog-lint
⧗   input: chore(foo): this won't pass
✖   scope must be one of [api, app, web] [scope-enum]
✖   found 1 problems, 0 warnings

❯ echo "chore: do some general maintenance" | conventional-changelog-lint
⧗   input: chore: do some general maintenance
✔   found 0 problems, 0 warnings
```

---
⇨ See [conventional-changelog-lint/shareable-config](/marionebl/conventional-changelog-lint/documentation/shareable-config.md) for details

---
Copyright (c) by [Mario Nebl](https://github.com/marionebl) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
