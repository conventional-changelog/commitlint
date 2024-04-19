# @commitlint/config-nx-scopes

Lint your nx project commits

Shareable `commitlint` config enforcing nx project and workspace names as scopes.
Use with [@commitlint/cli](../cli) and [@commitlint/prompt-cli](../prompt-cli).

## Getting started

```
npm install --save-dev @commitlint/config-nx-scopes @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-nx-scopes']};" > commitlint.config.js
```

## Filtering projects

You can filter projects by providing a filter function as the second parameter to `getProjects()`. The function will be called with an object containing each projects' `name`, `projectType`, and `tags`. Simply return a boolean to indicate whether the project should be included or not.

As an example, the following code demonstrates how to select only applications that are not end-to-end tests.

In your .commitlintrc.js file:

```javascript
async function getConfig() {
  const {
    default: {
      utils: {getProjects},
    },
  } = await import('@commitlint/config-nx-scopes');

  return {
    rules: {
      'scope-enum': async (ctx) => [
        2,
        'always',
        [
          ...(await getProjects(
            ctx,
            ({name, projectType}) =>
              !name.includes('e2e') && projectType == 'application'
          )),
        ],
      ],
    },
    // . . .
  };
}

module.exports = getConfig();
```

Here is another example where projects tagged with 'stage:end-of-life' are not allowed to be used as the scope for a commit.

In your .commitlintrc.js file:

```javascript
async function getConfig() {
  const {
    default: {
      utils: {getProjects},
    },
  } = await import('@commitlint/config-nx-scopes');

  return {
    rules: {
      'scope-enum': async (ctx) => [
        2,
        'always',
        [
          ...(await getProjects(
            ctx,
            ({tags}) => !tags.includes('stage:end-of-life')
          )),
        ],
      ],
    },
    // . . .
  };
}

module.exports = getConfig();
```

## Examples

```
❯ cat commitlint.config.js
{
  extends: ['@commitlint/config-nx-scopes']
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
