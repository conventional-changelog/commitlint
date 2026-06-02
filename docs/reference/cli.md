<script setup>
  import packageJson from "../../@commitlint/cli/package.json"
  const commitlintVersion = packageJson.version
</script>

# CLI

```sh-vue
❯ npx commitlint --help

@commitlint/cli@{{ commitlintVersion }} - Lint your commit messages

[input] reads from stdin if --edit, --env, --from and --to are omitted

Options:
  -c, --color           toggle colored output          [boolean] [default: true]
  -g, --config          path to the config file; result code 9 if config is
                        missing                                         [string]
      --default-config  use built-in default config
                        (@commitlint/config-conventional) when no rules are
                        found                                          [boolean]
      --print-config    print resolved config
                                          [string] [choices: "", "text", "json"]
  -d, --cwd             directory to execute in
                                         [string] [default: (Working Directory)]
  -e, --edit            read last commit message from the specified file or
                        fallbacks to ./.git/COMMIT_EDITMSG              [string]
  -E, --env             check message in the file at path given by environment
                        variable value                                  [string]
  -x, --extends         array of shareable configurations to extend      [array]
  -H, --help-url        help url in error message                       [string]
  -f, --from            lower end of the commit range to lint; applies if
                        edit=false                                      [string]
      --from-last-tag   uses the last tag as the lower end of the commit range
                        to lint; applies if edit=false and from is not set
                                                                       [boolean]
      --git-log-args    additional git log arguments as space separated string,
                        example '--first-parent --cherry-pick'          [string]
  -l, --last            just analyze the last commit; applies if edit=false
                                                                       [boolean]
  -o, --format          output format of the results                    [string]
  -p, --parser-preset   configuration preset to use for
                        conventional-commits-parser                     [string]
  -q, --quiet           toggle console output         [boolean] [default: false]
  -t, --to              upper end of the commit range to lint; applies if
                        edit=false                                      [string]
  -V, --verbose         enable verbose output for reports without problems
                                                                       [boolean]
      --legacy-output   use the legacy input output format (single-line 'input:
                        ...')                                          [boolean]
  -s, --strict          enable strict mode; result code 2 for warnings, 3 for
                        errors                                         [boolean]
      --options         path to a JSON file or Common.js module containing CLI
                        options
  -v, --version         display version information                    [boolean]
  -h, --help            Show help                                      [boolean]
```

## Lint without a config file

By default commitlint requires a configuration with rules to run — without one
it exits with an error (result code 9). Pass `--default-config` to fall back to
the built-in default config
([@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional))
when no rules are found, so commitlint can run without any setup:

```sh
echo "feat: add new feature" | npx commitlint --default-config
```

This is useful for one-off checks or server-side hooks (e.g. `pre-receive`)
where creating a `commitlint.config.js` and installing a shareable config is
not practical. A configuration file with rules always takes precedence over
`--default-config`, and configs passed via `--extends` are kept and override
the default config when the fallback applies.
