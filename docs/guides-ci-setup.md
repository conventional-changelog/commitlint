# Guide: CI Setup

Enforce commit conventions with confidence by linting on your CI servers with `commitlint`.

This guide assumes you have already configured `commitlint` for local usage.

Follow the [Getting Started](./?id=getting-started) for basic installation and configuration instructions.

## Travis

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

## CircleCI

It's just a simple example of how CircleCI configuration file could look like to validate last commit message

```yml
version: 2
defaults:
  working_directory: ~/project
  docker:
  - image: circleci/node:latest

jobs:
  setup:
    <<: *defaults
    steps:
    - checkout
    - restore_cache:
        key: lock-{{ checksum "package-lock.json" }}
    - run:
        name: Install dependencies
        command: npm install
    - save_cache:
        key: lock-{{ checksum "package-lock.json" }}
        paths:
        - node_modules
    - persist_to_workspace:
        root: ~/project
        paths:
        - node_modules

  lint_commit_message:
    <<: *defaults
    steps:
    - checkout
    - attach_workspace:
        at: ~/project
    - run:
        name: Define environment variable with lastest commit's message
        command: |
          echo 'export COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")' >> $BASH_ENV
          source $BASH_ENV
    - run:
        name: Lint commit message
        command: echo "$COMMIT_MESSAGE" | npx commitlint

workflows:
  version: 2
  commit:
    jobs:
    - setup
    - lint_commit_message: { requires: [setup] }
```

## GitLab CI

```yaml
lint:commit:
  stage: lint
  script:
    - echo "${CI_COMMIT_MESSAGE}" | npx commitlint
```

### 3rd party integrations

#### [Codemagic](https://codemagic.io/)

```yaml
#codemagic.yaml
workflows:
  commitlint:
    name: Lint commit message
    scripts:
      - npx commitlint --from=HEAD~1
```

?> Help yourself adopting a commit convention by using an interactive commit prompt. Learn how to use `@commitlint/prompt-cli` in the [Use prompt guide](guides-use-prompt.md)
