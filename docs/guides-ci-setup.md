# Guide: CI Setup

Enforce commit conventions with confidence by linting on your CI servers with `commitlint`.

This guide assumes you have a already configured `commitlint` for local usage.

Follow the [Getting Started](./?id=getting-started) for basic installation and configuration instructions.

```bash
# Install and configure if needed
npm install --save-dev @commitlint/travis-cli
```

```yml
# travis.yml
language: node_js
node_js:
  - node
script:
  - commitlint-travis
```

?> Help yourself adopting a commit convention by using an interactive commit prompt. Learn how to use `@commitlint/prompt-cli` in the [Use prompt guide](guides-use-prompt.md)
