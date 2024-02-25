# @commitlint/read

Read commit messages from a specified range or disk

## Install

```sh
npm install --save @commitlint/read
```

## Signature

```ts
type Range = {
  /* Lower end of the commit range to read */
  from: string;
  /* Upper end of the commit range to read */
  to: string;
  /* Whether (boolean) to read from ./.git/COMMIT_EDITMSG or where to read from (string) */
  edit?: boolean | string;
};

read(range: Range) => Promise<string[]>
```

## Import

```js
import read from '@commitlint/read';
```

## Examples

Consider to have a repository with two commits:

1. Initial commit
2. I did something

### Using `edit: true`

```js
const result = await read({edit: true});
console.info(result);
// => ['I did something\n\n']
```

### Read last two commits

```js
const result = await read({from: 'HEAD~2'});
console.info(result);
// => ['I did something\n\n', 'Initial commit\n\n']
```

### Read commits within a range

```js
const result = await read({from: 'HEAD~2', to: 'HEAD~1'});
console.info(result);
// => ['Initial commit\n\n']
```

### Read commit message from git gui file

```js
const result = await read({edit: './git/GITGUI_EDITMESSAGE'});
console.info(result);
// => ['I did something via git gui\n\n']
```
