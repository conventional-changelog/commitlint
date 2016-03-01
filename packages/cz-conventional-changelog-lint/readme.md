> reads your [conventional-changelog-lint](https://github.com/marionebl/conventional-changelog-lint)
> config and automatically creates matching
> [commitizen](https://github.com/commitizen/cz-cli) cli helpers for you.

# cz-conventional-changelog-lint

Let an interactive command line interface help you with
creating commit messages matching your
[conventional-changelog-lint](https://github.com/marionebl/conventional-changelog-lint) configuration.

## Installation

Fetch `cz-conventional-changelog-lint` via npm, install `peerDependencies`

```bash
npm install --save cz-conventional-changelog-lint commitizen
```

## Configuration

`cz-conventional-changelog-lint` is designed as `commitizen` adapter.
To use it with [commitizen](https://github.com/commitizen/cz-cli)
specify it as shared config:

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog-lint"
    }
  }
}
```

## Usage

Use the [commitizen](https://github.com/commitizen/cz-cli) command line
interface to start `cz-conventional-changelog-lint`.

```bash
# do stuff in your project …

# … then stage your changes
git add

# Execute the commitizen cli
git-cz
```

![cz-conventional-changelog-lint demo](./cz-conventional-changelog-lint.gif)

## History

`cz-conventional-changelog-lint` maintains full transparency over all changes.

*   Every release on npm has a corresponding Github release
*   A full changelog is automatically generated on release

---

⇨ See [changelog.md](./changelog.md) for a full list of changes

## Contributing

You dig `cz-conventional-changelog-lint` and want to submit a pull request?
Awesome! Be sure to read the [contribution guide](./contributing.md)
and you should be good to go.
Here are some notes to get you coding real quick.

```bash
git clone git@github.com:marionebl/cz-conventional-changelog-lint.git
cd cz-conventional-changelog-lint
npm install
npm start
```

---

`cz-conventional-changelog-lint` is built by Mario Nebl and [contributors](./documentation/contributors.md)
with :heart: and released under the [MIT License](./license.md).
