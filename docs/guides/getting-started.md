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
# Deno 2 only: create a local node_modules directory for Node.js module resolution
deno install --node-modules-dir=auto
```

:::

## Configuration

Configure commitlint to use conventional config

::: code-group

```sh [Linux / macOS]
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

```sh [Windows]
# Here we use the node command to avoid encoding issue on Windows.
node -e "fs.writeFileSync('commitlint.config.js', process.argv[1])" "export default { extends: ['@commitlint/config-conventional'] };"
```

:::

Refer to [configuration documentation](/reference/configuration) for more information.
