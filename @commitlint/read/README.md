> Read commit messages from a specified range or last edit

# @commitlint/read

## Getting started

```shell
npm install --save @commitlint/read
```

## Example

```js
const read = require('@commitlint/read');

// Read last edited commit message
read({edit: true}).then(messages => console.log(messages));
// => ['I did something\n\n']

// Read from the third to second commit message from HEAD
read({from: 'HEAD~2', to: 'HEAD~1'}).then(messages => console.log(messages));
// => ['Initial commit\n\n']
```

Consult [docs/api](https://conventional-changelog.github.io/commitlint/#/reference-api) for comprehensive documentation.
