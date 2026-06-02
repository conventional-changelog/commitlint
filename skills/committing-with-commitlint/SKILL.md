---
name: committing-with-commitlint
description: Use when writing a git commit message in a repository that uses commitlint — read the enforced convention first, write a compliant message, and self-correct from hook rejections instead of bypassing them
---

# Committing in a repository that uses commitlint

commitlint validates commit messages against the repository's configured convention
(usually [Conventional Commits](https://www.conventionalcommits.org)). The configuration
is the contract: read it before writing a commit message, and trust the error output
when a commit is rejected.

## 1. Detect whether the repository uses commitlint

Any of these means commitlint is in play:

- A config file in the repository root:
  `.commitlintrc`, `.commitlintrc.{json,yaml,yml,js,cjs,mjs,ts,cts,mts}`,
  or `commitlint.config.{js,cjs,mjs,ts,cts,mts}`
- A `"commitlint"` field in `package.json`
- A commit-msg hook that runs commitlint (check `.husky/commit-msg`, `lefthook.yml`,
  or `.git/hooks/commit-msg`)

## 2. Read the enforced rules

```bash
npx commitlint --print-config json
```

If this exits non-zero, the configuration itself is broken (for example an
unresolvable `extends`) — read the error on stderr instead of guessing.

Look at the `rules` object. Each rule is `[severity, applicability, value]`:

- **severity** — `0` = disabled, `1` = warning, `2` = error (only errors block commits)
- **applicability** — `"always"` = the condition must hold, `"never"` = it must not
- **value** — the rule's parameter (list, number, or string)

The rules that matter most when writing a message:

| Rule                   | What it controls                                                         |
| ---------------------- | ------------------------------------------------------------------------ |
| `type-enum`            | Allowed types (e.g. `feat`, `fix`, `chore`, ...)                         |
| `scope-enum`           | Allowed scopes (empty list = any scope allowed)                          |
| `scope-empty`          | `[2, "never"]` = scope is required; `[2, "always"]` = scope is forbidden |
| `subject-case`         | With `"never"`: cases the subject must NOT use                           |
| `subject-full-stop`    | With `"never"` and `"."`: subject must not end with a period             |
| `header-max-length`    | Maximum length of the first line                                         |
| `body-leading-blank`   | Blank line required between subject and body                             |
| `body-max-line-length` | Maximum length of each body line                                         |

A rule that is absent or disabled (severity 0) is simply not enforced. When unsure, use
a conservative baseline that passes the common presets: lower-case type, no trailing
period, header under 72 characters (config-conventional allows up to 100). Note that
running commitlint with no config at all fails with an `empty-rules` error rather than
falling back to any default convention.

## 3. Write the message

Format: `type(scope): subject` — the scope is optional unless `scope-empty` is `[2, "never"]`.

An example that satisfies `@commitlint/config-conventional`:

```
feat(parser): add support for inline issue references

Explain what changed and why. Separate the body from the subject with a blank
line (body-leading-blank) and keep lines within body-max-line-length.

Closes #123
```

## 4. Validate before committing

```bash
printf '%s' "feat(parser): add support for inline issue references

Explain what changed and why.

Closes #123" | npx commitlint
```

Exit code 0 with no output means the message passes. Validate the complete
message (header and body), not just the first line — body rules are checked
too. Doing this before committing is cheaper than a failed commit.

## 5. Self-correct when the commit-msg hook rejects

Rejection output names each violated rule in brackets:

```
⧗   --- input ---
Feat: Added new parser.
✖   subject must not be sentence-case, start-case, pascal-case, upper-case [subject-case]
✖   subject may not end with full stop [subject-full-stop]
✖   type must be lower-case [type-case]
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 4 problems, 0 warnings
```

- Fix ONLY the rules named in brackets; keep everything else identical.
- Re-validate via stdin (step 4), then retry the commit.
- NEVER bypass the hook with `git commit --no-verify` — fixing the message is
  always the correct action.
