# Guide: AI Agents

AI coding agents (Claude Code, Copilot, Cursor, and others) write a growing share of
commits. Your commitlint configuration is a machine-readable contract: agents follow
rules that are enforced and drift on rules that are not. This guide shows how to make
agents first-class citizens of your commit convention.

## Install the commitlint skill

For tools that support the [Agent Skills](https://agentskills.io) format (such as
Claude Code), commitlint ships a skill that teaches the agent to read your resolved
configuration, write a compliant message, and self-correct when the commit-msg hook
rejects:

```bash
mkdir -p .claude/skills/committing-with-commitlint
curl -fLo .claude/skills/committing-with-commitlint/SKILL.md \
  https://raw.githubusercontent.com/conventional-changelog/commitlint/master/skills/committing-with-commitlint/SKILL.md
```

For other tools, consult their documentation for where skills are loaded from — the
skill file itself is tool-neutral.

## No skill support?

Add this to your `AGENTS.md`, `CLAUDE.md`, or equivalent agent instructions file:

```markdown
## Commit convention

This repository enforces its commit convention with commitlint.

- Read the rules before committing: `npx commitlint --print-config json`
- Validate a message before using it: `printf '%s' "<message>" | npx commitlint`
  (exit 0 = valid)
- If the commit-msg hook rejects a commit, fix the rules named in brackets
  (e.g. `[subject-case]`) and retry. Never use `git commit --no-verify`.
```

## CLI primitives for agents and automation

| Command                                 | Purpose                                                        |
| --------------------------------------- | -------------------------------------------------------------- |
| `npx commitlint --print-config json`    | The resolved configuration (rules, parser preset) as JSON      |
| `printf '%s' "<msg>" \| npx commitlint` | Validate a candidate message from stdin                        |
| `npx commitlint --last`                 | Lint the last commit                                           |
| `npx commitlint --edit $1`              | Lint a commit-msg file (hook usage)                            |
| `npx commitlint --strict`               | Exit code 2 for warnings, 3 for errors (instead of 1 for both) |

## For LLMs reading these docs

The full documentation is available in LLM-friendly form:

- <https://commitlint.js.org/llms.txt> — index of all pages
- <https://commitlint.js.org/llms-full.txt> — entire documentation as one markdown file
