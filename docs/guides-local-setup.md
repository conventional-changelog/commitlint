# Guide: Local setup

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

This guide demonstrates how to achieve this via git hooks.

## Install commitlint

Install `commitlint` and a `commitlint-config-*` of your choice as devDependency and
configure `commitlint` to use it.

```bash
# Install and configure if needed
npm install --save-dev @commitlint/{cli,config-conventional}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Configure commitlint to use conventional config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Alternatively the configuration can be defined in a `commitlint.config.js`, `.commitlintrc.js`, `.commitlintrc`, `.commitlintrc.json`, `.commitlintrc.yml` file or a `commitlint` field in `package.json`.

## Install husky

Install `husky` as devDependency, a handy git hook helper available on npm.

```sh
# Install Husky v6
npm install husky --save-dev
# or
yarn add husky --dev

# Activate hooks
npx husky install
# or
yarn husky install
```

### Add hook

```
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

**Please note that currently @commitlint/cli doesn't support yarn v2 Plug'n'Play (using yarn v2 with `nodeLinker: node-modules` in your .yarnrc.yml file may work sometimes)**\
Check the [husky documentation](https://typicode.github.io/husky/#/?id=manual) on how you can automatically have Git hooks enabled after install for different `yarn` versions.

## Test

### Test simple usage

For a first simple usage test of commitlint you can do the following:

```bash
npx commitlint --from HEAD~1 --to HEAD --verbose
```

This will check your last commit and return an error if invalid or a positive output if valid.

### Test the hook

You can test the hook by simply committing. You should see something like this if everything works.

```bash
git commit -m "foo: this will fail"
husky > commit-msg (node v10.1.0)
No staged files match any of provided globs.
⧗   input: foo: this will fail
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky > commit-msg hook failed (add --no-verify to bypass)
```

Since [v8.0.0](https://github.com/conventional-changelog/commitlint/releases/tag/v8.0.0) `commitlint` won't output anything if there is not problem with your commit.\
(You can use the `--verbose` flag to get positive output)

```bash
git commit -m "chore: lint on commitmsg"
husky > pre-commit (node v10.1.0)
No staged files match any of provided globs.
husky > commit-msg (node v10.1.0)
```

?> Local linting is fine for fast feedback but can easily be tinkered with. To ensure all commits are linted you'll want to check commits on an automated CI Server too. Learn how to in the [CI Setup guide](guides-ci-setup.md).
