# Guide: Use prompt

> [!WARNING]
> Prompt is currently unmaintained  
> Some things might not work as expected

`@commitlint/prompt-cli` helps with fast authoring of commit messages and ensures they adhere to the commit convention configured in `commitlint.config.js`.

## Install

1. Create a git repository if needed

   ```sh
   git init
   ```

2. Create a package.json if needed

   ::: code-group

   ```sh [npm]
   npm init
   ```

   ```sh [yarn]
   yarn init
   ```

   ```sh [pnpm]
   pnpm init
   ```

   ```sh [bun]
   bun init
   ```

   :::

3. Install and configure if needed

   ::: code-group

   ```sh [npm]
   npm install --save-dev @commitlint/cli @commitlint/config-conventional @commitlint/prompt-cli

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

   ```sh [yarn]
   yarn add --dev @commitlint/cli @commitlint/config-conventional @commitlint/prompt-cli

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

   ```sh [pnpm]
   pnpm add --save-dev @commitlint/cli @commitlint/config-conventional @commitlint/prompt-cli

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

   ```sh [bun]
   bun add --dev @commitlint/cli @commitlint/config-conventional @commitlint/prompt-cli

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

   ```sh [deno]
   deno add --dev npm:@commitlint/cli npm:@commitlint/config-conventional npm:@commitlint/prompt-cli

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

   :::

## Provide a shortcut

To make prompt-cli easy to use, add a npm run-script to your `package.json`

```json:line-numbers {3}
{
  "scripts": {
    "commit": "commit"
  }
}
```

Test the prompt by executing

::: code-group

```sh [npm]
git add .
npm run commit
```

```sh [yarn]
git add .
yarn commit
```

```sh [pnpm]
git add .
pnpm commit
```

```sh [bun]
git add .
bun commit
```

```sh [deno]
git add .
deno task commit
```

:::

## Use a config file from a custom path

By default the prompt picks up the configuration the same way `commitlint` does, starting from the current working directory.
Pass `--config` (or `-g`) to load a specific file instead, just like with [`@commitlint/cli`](/reference/cli):

```json:line-numbers {3}
{
  "scripts": {
    "commit": "commit --config ./config/commitlint.config.js"
  }
}
```

Relative paths are resolved from the current working directory.

You can also pass the flag when running the script. With npm it has to come after `--`: otherwise npm takes `--config` and `-g` for options of its own, and the prompt silently uses the default config.

::: code-group

```sh [npm]
npm run commit -- --config ./config/commitlint.config.js
```

```sh [yarn]
yarn commit --config ./config/commitlint.config.js
```

```sh [pnpm]
pnpm commit --config ./config/commitlint.config.js
```

```sh [bun]
bun commit --config ./config/commitlint.config.js
```

:::

# An alternative to `@commitlint/prompt-cli`: commitizen

Another way to author commit messages that adhere to the commit convention configured in `commitlint.config.js` is to use `commitizen`.
For more information, checkout their [official website](http://commitizen.github.io/cz-cli/).

commitlint provides two adapters for `commitizen`:

1. `@commitlint/prompt` provides a way to interact same as `@commitlint/prompt-cli`
2. `@commitlint/cz-commitlint` is inspired by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog), it provides a more modern way to interact.
