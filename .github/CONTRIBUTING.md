> Lint commit messages

# commitlint

Yeay! You want to contribute to commitlint. That's amazing!
To smoothen everyone's experience involved with the project please take note of the following guidelines and rules.

## Found an Issue?

Thank you for reporting any issues you find. We do our best to test and make commitlint as solid as possible, but any reported issue is a real help.

> commitlint issues

Please follow these guidelines when reporting issues:

- Provide a title in the format of `<Error> when <Task>`
- Tag your issue with the tag `bug`
- Provide a short summary of what you are trying to do
- Provide the log of the encountered error if applicable
- Provide the exact version of commitlint. Check `npm ls @commitlint/cli` when in doubt
- Be awesome and consider contributing a [pull request](#want-to-contribute)

## Want to contribute?

You consider contributing changes to commitlint – we dig that!
Please consider these guidelines when filing a pull request:

> commitlint pull requests

- Follow the [Coding Rules](#coding-rules)
- Follow the [Commit Rules](#commit-rules)
- Make sure you rebased the current master branch when filing the pull request
- Keep a clear commit history: squash incidental/WIP commits, but for features and bug fixes follow [Test-driven development](#test-driven-development) — a failing-test commit, then the implementation
- Provide a short title with a maximum of 100 characters
- Provide a more detailed description containing
  _ What you want to achieve
  _ What you changed
  _ What you added
  _ What you removed

### Working with maintainers

A pull request is driven by its author. When you receive review feedback — whether from a maintainer or an automated reviewer — please either address it or reply explaining why you'd skip it, so the PR can keep moving. If anything is unclear, just ask; we're happy to help.

### Coding Rules

To keep the code base of commitlint neat and tidy the following rules apply to every change

> Coding standards

- `prettier` is king
- Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
- Be awesome

### Commit Rules

To help everyone with understanding the commit history of commitlint the following commit rules are enforced.
To make your life easier commitlint is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards

- [conventional-changelog](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/prompt)
- husky commit message hook available
- present tense
- maximum of 100 characters
- message format of `$type($scope): $message`

### Environment setup

> [!IMPORTANT]
> **Upgrading from a pre-pnpm clone?**
> This repo switched from yarn to pnpm. If your local checkout predates that,
> run a one-time cleanup before `pnpm install`:
>
> ```sh
> rm -rf node_modules @commitlint/*/node_modules @packages/*/node_modules @alias/*/node_modules
> # If you have an open PR with yarn.lock changes, rebase onto master
> # and regenerate pnpm-lock.yaml with `pnpm install`.
> ```

This project uses `pnpm`, so be sure that it is available in your shell environment.
The required version is pinned in `package.json` (`packageManager` field); the
easiest ways to install it are:

- [mise](https://mise.jdx.dev/): `mise install` (uses `.mise.toml`)
- [corepack](https://nodejs.org/api/corepack.html): `corepack enable` (ships with Node)
- [direct install](https://pnpm.io/installation)

After cloning the repo run

```sh
pnpm install
```

### Testing

From the project root directory, use the following commands to run the test suite

```sh
pnpm build
pnpm test
```

### Test-driven development

For features and bug fixes we follow [test-driven development](https://martinfowler.com/bliki/TestDrivenDevelopment.html) ("red, green, refactor"): write a test that fails because the behavior doesn't exist yet, then write the code that makes it pass.

Please mirror this in your pull request with two commits:

1. **Tests first** — add tests for the new behavior. On their own they must fail (CI red), which proves they actually exercise the change.
2. **Implementation** — add the code that makes them pass (CI green).

Make sure the test commit fails for the _right reason_ — a failing assertion, not a build error — and that each test would pass only _with_ your change. A test that passes without the implementation isn't testing it.

```sh
# commit 1 — failing tests (CI red)
git commit -m "test: cover <behavior>"

# commit 2 — implementation (CI green)
git commit -m "feat(<scope>): <behavior>"
```

### Documentation updates

Documentation uses `vitepress`.
To run and edit the documentation locally run:

```sh
pnpm docs-dev
```

To have a preview of the deployed doc run:

```sh
pnpm docs-build
pnpm docs-preview
```

For more information refer to [vitepress documentation](https://vitepress.dev).

## Package dependency overview

![commitlint-dependencies](https://user-images.githubusercontent.com/4248851/58385093-34b79780-7feb-11e9-8f27-bffc4aca3eba.png)

(Partly outdated)

## Publishing a release

```sh
npm login
mise install
```

- [mise](https://mise.jdx.dev/)

```sh
pnpm clean
pnpm install
pnpm build
pnpm test
pnpm run publish --otp <one-time password>
```

If something in between fails (like a new package was added and needs to be published for the
first time but you forgot) you can use `lerna publish from-package` to publish anything that
has not been published yet.

### Create GitHub release

1. Copy changelog entry for the new version
1. Create release for the new tag: https://github.com/conventional-changelog/commitlint/releases
1. Post in the [commitlint Slack-channel][12]

### Publish a `next` release (or i.e. patch release)

```sh
npm login
mise install
```

```sh
pnpm clean
pnpm install
pnpm build
pnpm test
pnpm lerna publish --conventional-commits --dist-tag [`next` | `next` | `[release-vXX(BRANCH)]`] --otp <one-time password>
```

If for some reason this stops in between, you can manually publish missing packages like this:

```sh
npm publish <package-name> --tag [`latest` | `next` | `[release-vXX(BRANCH)]`] --otp <one-time password>
```

Depending on the state of the packages you might need to run `npm pack` in each failed package and then publish it.

#### Publishing (new) packages for the first time

```sh
npm publish [PACKAGE_NAME] --access public
```

From within the folder first i.e. `cd @commitlint/new-packages`.

#### Move `next` to `latest`

```sh
npm login
```

```sh
npx lerna exec --no-bail --no-private --no-sort --stream -- '[ -n "$(npm v . dist-tags.next)" ] && npm dist-tag add ${LERNA_PACKAGE_NAME}@$(npm v . dist-tags.next) latest --otp <one-time password>'
```

Remove next:

```sh
npx lerna exec --no-bail --no-private --no-sort --stream -- '[ -n "$(npm v . dist-tags.next)" ] && npm dist-tag rm ${LERNA_PACKAGE_NAME} next --otp <one-time password>'
```
