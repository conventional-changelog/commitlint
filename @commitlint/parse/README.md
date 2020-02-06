> Parse commit messages to structured data

# @commitlint/parse

## Install

```
npm install --save @commitlint/parse
```

## Use

```js
const parse = require('@commitlint/parse');
```

## API

### parse(message: string, parser: Function, parserOpts: Object)

- **message**: Commit message to parser
- **parser**: Sync parser function to use. Defaults to `sync` of `conventional-commits-parser`
- **parserOpts**: Options to pass to `parser`
  ```
  {
    commentChar: null, // character indicating comment lines
    issuePrefixes: ['#'] // prefix characters for issue references
  }
  ```
