> commit prompt using .commitlintrc

# @commitlint/prompt

## Installation

```bash
npm install --save @commitlint/prompt commitizen
```

## Configuration

`@commitlint/prompt` is a `commitizen` adapter.
Configure `commitizen` to use it:

```json
{
  "config": {
    "commitizen": {
      "path": "@commitlint/prompt"
    }
  }
}
```

## Usage

Use the [commitizen](https://github.com/commitizen/cz-cli) command line
interface to start `@commitlint/prompt`.

```bash
# do stuff in your project …

# … then stage your changes
git add

# Execute the commitizen cli
git-cz
```
