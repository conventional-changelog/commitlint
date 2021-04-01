> Commitizen adapter using the commitlint.config.js

# @commitlint/cz-commitlint

This is a commitizen adapter, using this adapter, commitizen works based on commitlint.config.js.

Submit by commitizen, lint by commitlint, just need maintain one configuration file, Consistent and Scalable.

The interactive process is inspired by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

## Getting started

### Using commitizen adapter

```bash
npm install --save-dev @commitlint/cz-commitlint commitizen
```

In package.json

```
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

### Configure commitlint

```bash
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Simple: config with conventional
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js

# commitlint configuration is shareable,
# Install lerna-scopes
npm install --save-dev @commitlint/config-lerna-scopes
# Scalable: config with lerna-scopes in monorepo mode
echo "module.exports = {extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes']};" > commitlint.config.js
```

### Set Git Hooks by husky

```base

# ------- using npm ----------
# Install Husky
npm install husky --save-dev
# Active hooks
npx husky install
# Add commitlint hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
# Add commitizen hook
npx husky add .husky/prepare-commit-msg 'exec < /dev/tty && node_modules/.bin/cz --hook || true'


# ------- using yarn ----------
# Install Husky
yarn add husky --dev
# Active hooks
yarn husky install
# Add commitlint hook
yarn husky add .husky/commit-msg 'yarn --no-install commitlint --edit $1'
# Add commitizen hook
yarn husky add .husky/prepare-commit-msg 'exec < /dev/tty && node_modules/.bin/cz --hook || true'

```

### Try it out

```bash
git add .
npm run commit
# or
yarn run commit
```

## Related

- [Commitlint Shared Configuration](https://github.com/conventional-changelog/commitlint#shared-configuration) - You can find more shared configurations are available to install and use with commitlint
