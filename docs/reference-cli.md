# CLI

```bash
❯ npx commitlint --help

@commitlint/cli@8.3.5 - Lint your commit messages

[input] reads from stdin if --edit, --env, --from and --to are omitted

Options:
  --color, -c          toggle colored output           [boolean] [default: true]
  --config, -g         path to the config file                          [string]
  --cwd, -d            directory to execute in
                                      [string] [default: "/projects/commitlint"]
  --edit, -e           read last commit message from the specified file or
                       fallbacks to ./.git/COMMIT_EDITMSG
                                                       [string] [default: false]
  --env, -E            check message in the file at path given by environment
                       variable value                                   [string]
  --extends, -x        array of shareable configurations to extend       [array]
  --help-url, -H       helpurl in error message                         [string]
  --from, -f           lower end of the commit range to lint; applies if
                       edit=false                                       [string]
  --format, -o         output format of the results                     [string]
  --parser-preset, -p  configuration preset to use for
                       conventional-commits-parser                      [string]
  --quiet, -q          toggle console output          [boolean] [default: false]
  --to, -t             upper end of the commit range to lint; applies if
                       edit=false                                       [string]
  --verbose, -V        enable verbose output for reports without problems
                                                                       [boolean]
  -v, --version        display version information                     [boolean]
  -h, --help           Show help                                       [boolean]
```
