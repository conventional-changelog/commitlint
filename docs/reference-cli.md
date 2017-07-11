# CLI

## Installation

```bash
npm install --save-dev @commitlint/cli
```

## Usage

```bash
❯ commitlint --help
  commitlint - Lint commit messages

  [input] reads from stdin if --edit, --from, --to are omitted
  --color,-c    toggle formatted output, defaults to: true
  --edit,-e     read last commit message found in ./git/COMMIT_EDITMSG
  --extends,-x  array of shareable configurations to extend
  --from,-f     lower end of the commit range to lint; applies if edit=false
  --to,-t       upper end of the commit range to lint; applies if edit=false
  --quiet,-q    toggle console output
```
