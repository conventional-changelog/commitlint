> Commitizen adapter using the commitlint.config.js

# @commitlint/cz-commitlint

This is a commitizen adapter, using this adapter, commitizen works based on commitlint.config.js.

Submit by commitizen, lint by commitlint, just need maintain one configuration file, Consistent and Scalable.

The interactive process is inspired by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

## Getting started

### Configure commitizen adapter

```bash
npm install --save-dev @commitlint/cz-commitlint commitizen inquirer@9  # inquirer is required as peer dependency
# or yarn
yarn add -D @commitlint/cz-commitlint commitizen inquirer@9             # inquirer is required as peer dependency
```

In package.json

```json
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

**⚠️ Important: The required version of commitlint and shared configuration is above 12.1.2, update them if already existed in project**

```bash
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/config-conventional @commitlint/cli commitlint-config-gitmoji
# or yarn
yarn add @commitlint/config-conventional @commitlint/cli commitlint-config-gitmoji -D

# Simple: config with conventional
import { UserConfig } from "@commitlint/types";
import gitmoji from 'commitlint-config-gitmoji'

/**
 * @type {import('@commitlint/types').UserConfig}
 */ for .js file
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "✨",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description:
              "Changes that do not affect the meaning of the code (linters)",
            title: "Styles",
            emoji: "🎨",
          },
          refactor: {
            description:
              "A code change that neither fixes a bug nor adds a feature",
            title: "Code Refactoring",
            emoji: "📦",
          },
          perf: {
            description: "A code change that improves performance",
            title: "Performance Improvements",
            emoji: "🚀",
          },
          test: {
            description: "Adding missing tests or correcting existing tests",
            title: "Tests",
            emoji: "🚨",
          },
          build: {
            description:
              "Changes that affect the build system or external dependencies (yarn)",
            title: "Builds",
            emoji: "🏗️ ",
          },
          ci: {
            description:
              "Changes to our CI configuration files and scripts (GitActions)",
            title: "Continuous Integrations",
            emoji: "⚙️ ",
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: "Chores",
            emoji: "♻️ ",
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
            emoji: "⏪",
          },
        },
      },
    },
  },
  parserPreset: {
    parserOpts: gitmoji.parserPreset.parserOpts,
    plugins: [gitmoji.parserPreset.plugins],
  },
  ...gitmoji.rules,
  ...gitmoji.plugins
} as UserConfig
```

```json
.czrc

{
  "path": "@commitlint/cz-commitlint",
  "useGitmojis": true
}

```
### Try it out

```bash
git add .
npm run commit
# or yarn
yarn commit
```

## Related

- [Commitlint Reference Prompt](https://commitlint.js.org/reference/prompt) - How to customize prompt information by setting commitlint.config.js
