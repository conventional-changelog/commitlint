> commitizen adapter using .commitlintrc

# @commitlint/prompt

## Getting started

```bash
npm install --save @commitlint/prompt @commitlint/config-angular commitizen
echo '{"extends": ["@commitlint/config-angular"]}' > .commitlintrc
```

In package.json
```
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/prompt"
    }
  }
}
```

```bash
git add .
npm run commit
```
