# Guide: Local setup

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

This guide demonstrates how to achieve this via git hooks.

Follow the [Getting Started](/guides/getting-started) for basic installation and configuration instructions.

## Add hook

To use commitlint you need to setup `commit-msg` hook

### Using a git hooks manager

To lint commits before they are created you can use [Husky](https://typicode.github.io/husky/)'s `commit-msg` hook.

You can find complete setup instructions on the [official documentation](https://typicode.github.io/husky/get-started.html).

> [!NOTE]
> The following instructions are meant to `husky@v9` if you are using a different version
> consult the official documentation of your version.

---

:::tabs
== npm

```sh
npm install --save-dev husky

npx husky init

# Add commit message linting to commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

As an alternative you can create a script inside `package.json`

```sh
npm pkg set scripts.commitlint="commitlint --edit"
echo "npm run commitlint \${1}" > .husky/commit-msg
```

== yarn

```sh
yarn add --dev husky

yarn husky init

# Add commit message linting to commit-msg hook
echo "yarn commitlint --edit \$1" > .husky/commit-msg
```

As an alternative you can create a script inside `package.json`

```sh
npm pkg set scripts.commitlint="commitlint --edit"
echo "yarn commitlint \${1}" > .husky/commit-msg
```

> [!WARNING]
> Please note that currently @commitlint/cli doesn't support yarn v2 Plug'n'Play (using yarn > v2 with `nodeLinker: node-modules` in your .yarnrc.yml file may work sometimes)

:::

---

### Using git hooks

Info about git hooks can be found on [Git documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

> [!WARNING]
> It's necessary that you use **commit-msg** as the name for hook file.

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
#  husky > commit-msg
No staged files match any of provided globs.
⧗   input: foo: this will fail
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg script failed (code 1)
```

Since [v8.0.0](https://github.com/conventional-changelog/commitlint/releases/tag/v8.0.0) `commitlint` won't output anything if there are no problems with your commit.\
(You can use the `--verbose` flag to get positive output)

```bash
git commit -m "chore: lint on commitmsg"
# husky > pre-commit
No staged files match any of provided globs.
# husky > commit-msg
```

?> Local linting is fine for fast feedback but can easily be tinkered with. To ensure all commits are linted you'll want to check commits on an automated CI Server too. Learn how to in the [CI Setup guide](/guides/ci-setup).
