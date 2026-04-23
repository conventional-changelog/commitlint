# Guide: Local setup

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

This guide demonstrates how to achieve this via git hooks.

Follow the [Getting Started](/guides/getting-started) for basic installation and configuration instructions.

## Add hook

To use commitlint you need to setup `commit-msg` hook (currently `pre-commit` hook is not supported)

### Using a git hooks manager

To lint commits before they are created you can use [Husky](https://typicode.github.io/husky/)'s `commit-msg` hook.

You can find complete setup instructions on the [official documentation](https://typicode.github.io/husky/get-started.html).

> [!NOTE]
> The following instructions are meant to `husky@v9` if you are using a different version
> consult the official documentation of your version.

---

<!--
**Note:**

Command `echo "xxxx" > file` on Windows PowerShell v5 will create
an UTF-16 LE file, which may cause execution failure.
https://github.com/typicode/husky/issues/1426

So here we use the `node -e` command create the UTF-8 file. And hex encode the dollar sign
to `\x24` in single-quote string to avoid escaping issues on various shells. (issue#4728)
-->

:::tabs
== npm

```sh
npm install --save-dev husky

# husky@v9
npx husky init
# husky@v8 or lower
npx husky install

# Add commit message linting to commit-msg hook
node -e "fs.writeFileSync('.husky/commit-msg','npx --no -- commitlint --edit \x241\n')"
```

As an alternative you can create a script inside `package.json`

```sh
npm pkg set scripts.commitlint="commitlint --edit"
node -e "fs.writeFileSync('.husky/commit-msg','npm run commitlint \x24{1}\n')"
```

== yarn

```sh
yarn add --dev husky

# husky@v9
yarn husky init
# husky@v8 or lower
yarn husky install

# Add commit message linting to commit-msg hook
node -e "fs.writeFileSync('.husky/commit-msg','yarn commitlint --edit \x241\n')"
```

As an alternative you can create a script inside `package.json`

```sh
npm pkg set scripts.commitlint="commitlint --edit"
node -e "fs.writeFileSync('.husky/commit-msg','yarn commitlint \x24{1}\n')"
```

> [!WARNING]
> Please note that currently @commitlint/cli doesn't support yarn v2 Plug'n'Play (using yarn > v2 with `nodeLinker: node-modules` in your .yarnrc.yml file may work sometimes)

== pnpm

```sh
pnpm add --save-dev husky

# husky@v9
pnpm husky init
# husky@v8 or lower
pnpm husky install

# Add commit message linting to commit-msg hook
node -e "fs.writeFileSync('.husky/commit-msg','pnpm dlx commitlint --edit \x241\n')"
```

As an alternative you can create a script inside `package.json`

```sh
npm pkg set scripts.commitlint="commitlint --edit"
node -e "fs.writeFileSync('.husky/commit-msg','pnpm commitlint \x24{1}\n')"
```

== bun

```sh
bun add --dev husky

# husky@v9
bunx husky init
# husky@v8 or lower
bunx husky install

# Add commit message linting to commit-msg hook
node -e "fs.writeFileSync('.husky/commit-msg','bunx commitlint --edit \x241\n')"
```

== deno

```sh
deno add --dev husky

# husky@v9
deno task --eval husky init
# husky@v8 or lower
deno task --eval husky install

# Add commit message linting to commit-msg hook
node -e "fs.writeFileSync('.husky/commit-msg','deno task --eval commitlint --edit \x241\n')"
```

:::

---

### Using git hooks

Info about git hooks can be found on [Git documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

> [!WARNING]
> It's necessary that you use **commit-msg** as the name for hook file.

## Test

### Test simple usage

For a first simple usage test of commitlint you can do the following:

::: code-group

```sh [npm]
npx commitlint --from HEAD~1 --to HEAD --verbose
```

```sh [yarn]
yarn commitlint --from HEAD~1 --to HEAD --verbose
```

```sh [pnpm]
pnpm commitlint --from HEAD~1 --to HEAD --verbose
```

```sh [bun]
bun commitlint --from HEAD~1 --to HEAD --verbose
```

```sh [deno]
deno task --eval commitlint --from HEAD~1 --to HEAD --verbose
```

:::

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

Local linting is fine for fast feedback but can easily be tinkered with. To ensure all commits are linted you'll want to check commits on an automated CI Server too. Learn how to in the [CI Setup guide](/guides/ci-setup).
