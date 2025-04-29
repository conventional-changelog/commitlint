# Getting started

## Install

Install `@commitlint/cli` and a `@commitlint/config-*` / `commitlint-config-*` of your choice as devDependency and configure `commitlint` to use it.

::: code-group

```sh [npm]
npm install --save-dev @commitlint/{cli,config-conventional}
```

```sh [yarn]
yarn add --dev @commitlint/{cli,config-conventional}
```

```sh [npm (Windows)]
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

```sh [pnpm]
pnpm add --save-dev @commitlint/{cli,config-conventional}
```

```sh [bun]
bun add -d @commitlint/cli @commitlint/config-conventional
```

```sh [deno]
deno add --dev npm:@commitlint/cli npm:@commitlint/config-conventional
```

:::

## Configuration

Configure commitlint to use conventional config

```sh
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Refer to [configuration documentation](/reference/configuration) for more information.
