# CLI

```bash
❯ npx commitlint --help

@commitlint@6.2.0 - Lint your commit messages

[input] reads from stdin if --edit, --env, --from and --to are omitted
--color, -c            toggle colored output, defaults to: true
--config, -g           path to the config file
--cwd, -d              directory to execute in, defaults to: $CD
--edit, -e             read last commit message from the specified file or fallbacks to ./.git/COMMIT_EDITMSG
--env, -E              check message in the file at path given by environment variable value
--extends, -x          array of shareable configurations to extend
--help, -h             display this help message
--from, -f             lower end of the commit range to lint; applies if edit=false
--format, -o           output format of the results
--parser-preset, -p    configuration preset to use for conventional-commits-parser
--quiet, -q            toggle console output
--to, -t               upper end of the commit range to lint; applies if edit=false
--version, -v          display version information
```
