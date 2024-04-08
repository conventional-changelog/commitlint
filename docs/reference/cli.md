# CLI

```sh
❯ npx commitlint --help

@commitlint/cli@11.0.0 - Lint your commit messages

[input] reads from stdin if --edit, --env, --from and --to are omitted

Options:
  -c, --color          toggle colored output           [boolean] [default: true]
  -g, --config         path to the config file                          [string]
      --print-config   print resolved config
                                          [string] [choices: "", "text", "json"]
  -d, --cwd            directory to execute in
                                         [string] [default: (Working Directory)]
  -e, --edit           read last commit message from the specified file or
                       fallbacks to ./.git/COMMIT_EDITMSG               [string]
  -E, --env            check message in the file at path given by environment
                       variable value                                   [string]
  -x, --extends        array of shareable configurations to extend       [array]
  -H, --help-url       help url in error message                        [string]
  -f, --from           lower end of the commit range to lint; applies if
                       edit=false                                       [string]
  -o, --format         output format of the results                     [string]
  -p, --parser-preset  configuration preset to use for
                       conventional-commits-parser                      [string]
  -q, --quiet          toggle console output          [boolean] [default: false]
  -t, --to             upper end of the commit range to lint; applies if
                       edit=false                                       [string]
  -V, --verbose        enable verbose output for reports without problems
                                                                       [boolean]
  -v, --version        display version information                     [boolean]
  -h, --help           Show help                                       [boolean]
```
