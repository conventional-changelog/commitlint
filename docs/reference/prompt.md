# Prompt

Prompt Config is used by `@commitlint/cz-commitlint`.

There are three fields: `settings`, `messages` and `questions`

## `settings`

Set optional options.

- `enableMultipleScopes`: `(boolean)` Enable multiple scopes, select scope with a radio list, disabled by default.
- `scopeEnumSeparator`: `(string)` Commitlint supports [multiple scopes](/concepts/commit-conventions#multiple-scopes), you can specify the delimiter. It is applied when `enableMultipleScopes` set true.

## `messages`

Set hint contents, you can configure it to support localization.

- `skip`: The field can be skipped by pressing enter
- `max`: Maximum number of characters
- `min`: Minimum number of characters
- `emptyWarning`: The field cannot be empty
- `upperLimitWarning`: The character limit is exceeded
- `lowerLimitWarning`: The characters are less than lower limit

## `questions`

Specify the interactive steps, Steps can only be configured in

- `header`
- `type`
- `scope`
- `subject`
- `body`
- `footer`
- `isBreaking`
- `breaking`
- `breakingBody`
- `isIssueAffected`
- `issues`
- `issuesBody`

![cz-commitlint questions](/assets/cz-commitlint.png)

```js
export default {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    ...
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description:
          'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  }
};
```
