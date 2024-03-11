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
- Squash your commits when filing the pull request
- Provide a short title with a maximum of 100 characters
- Provide a more detailed description containing
  _ What you want to achieve
  _ What you changed
  _ What you added
  _ What you removed

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

This project uses `yarn`, so be sure that it is available in your shell environment.

After cloning the repo run

```sh
yarn install
```

### Testing

From the project root directory, use the following commands to run the test suite

```sh
yarn build
yarn test
```

### Documentation updates

Documentation uses `vitepress`.
To run and edit the documentation locally run:

```sh
yarn docs-dev
```

To have a preview of the deployed doc run:

```sh
yarn docs-build
yarn docs-serve
```

For more information refer to [vitepress documentation](https://vitepress.dev).

## Package dependency overview

![commitlint-dependencies](https://user-images.githubusercontent.com/4248851/58385093-34b79780-7feb-11e9-8f27-bffc4aca3eba.png)

(Partly outdated)

## Publishing a release

```sh
npm login
nvm use (if you have nvm installed)
```

- [nvm](https://github.com/nvm-sh/nvm)
- [asdf](https://asdf-vm.com/) is supported as well

```sh
yarn clean
yarn install
yarn build
yarn test
yarn run publish --otp <one-time password>
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
nvm use (if you have nvm installed)
```

```sh
yarn clean
yarn install
yarn build
yarn test
npx lerna publish --conventional-commits --dist-tag [`next` | `[release-vXX(BRANCH)]`] --otp <one-time password>
```

If for some reason this stops in between, you can manually publish missing packages like this:

```sh
npm publish <package-name> --tag [`next` | `[release-vXX(BRANCH)]`] --otp <one-time password>
```

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
