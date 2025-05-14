# Getting started

## Install

Install `@commitlint/cli` and a `@commitlint/config-*` / `commitlint-config-*` of your choice as devDependency and configure `commitlint` to use it.

::: code-group

```sh [npm]
npm install -D @commitlint/cli @commitlint/config-conventional
```

```sh [yarn]
yarn add -D @commitlint/cli @commitlint/config-conventional
```

```sh [pnpm]
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

```sh [bun]
bun add -d @commitlint/cli @commitlint/config-conventional
```

```sh [deno]
deno add -D npm:@commitlint/cli npm:@commitlint/config-conventional
```

:::

## Configuration

Configure commitlint to use conventional config

```sh
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

> [!WARNING]
> Node v24 changes the way that modules are loaded, and this includes the commitlint config file. If your project does not contain a `package.json`, commitlint may fail to load the config, resulting in a `Please add rules to your commitlint.config.js` error message. This can be fixed by doing either of the following:
>
> - Add a `package.json` file, declaring your project as an ES6 module. This can be done easily by running `npm init es6`.
> - Rename the config file from `commitlint.config.js` to `commitlint.config.mjs`.

Refer to [configuration documentation](/reference/configuration) for more information.
