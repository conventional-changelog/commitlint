# Concept: Commit conventions

[Commit conventions](https://www.conventionalcommits.org/) allow your team to add more semantic meaning to your git history. This e.g. includes `type`, `scope` or `breaking changes`.

With this additional information tools can derive useful human-readable information for releases of your project. Some examples are

- Automated, rich changelogs
- Automatic version bumps
- Filter for test harnesses to run

The most common commit conventions follow this pattern:

```text
type(scope?): subject
body?
footer?
```

## Multiple scopes

Commitlint supports multiple scopes. Segments may be separated using delimiters (default: `/`, `\`, `,`).

The set of allowed delimiters can be customized via the [scope-delimiter-style](/reference/rules.html#scope-delimiter-style) rule.
