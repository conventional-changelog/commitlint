# Guide: Use prompt

`@commitlint/prompt-cli` helps with fast authoring of commit messages and ensures they adhere to the commit convention configured in `commitlint.config.js`.

## Install

1. Create a git repository if needed

   ```sh
   git init
   ```

2. Create a package.json if needed

   ```sh
   npm init
   ```

3. Install and configure if needed

   ```sh
   npm install --save-dev @commitlint/{cli,config-conventional,prompt-cli}

   echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
   ```

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

```bash
git add .
npm run commit
```

## An alternative to `@commitlint/prompt-cli`: commitizen

Another way to author commit messages that adhere to the commit convention configured in `commitlint.config.js` is to use `commitizen`.
For more information, checkout their [official website](http://commitizen.github.io/cz-cli/).

commitlint provides two adapters for `commitizen`:

1. `@commitlint/prompt` provides a way to interact same as `@commitlint/prompt-cli`
2. `@commitlint/cz-commitlint` is inspired by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog), it provides a more modern way to interact.
