# Troubleshooting

## Getting `Range error: Found invalid rule names: [...]` after update {#range-error-invalid-rule}

After updating one or more `@commitlint` packages you might encounter an error like:

```text
Found invalid rule names: header-trim.
Supported rule names are: body-case, body-empty, ...
```

The source of this error is likely a mismatch of version between `@commitlint` packages in `node_modules`.

E.g.: you might have a config requesting a rule that is not included in `@commitlint/rules`.

> [!TIP]
> If you are relying on a config which depends on an earlier version of `@commitlint/config-conventional` be sure to update them:
>
> ```sh
> npm update @commitlint/config-conventional
> ```

---

> [!NOTE]
> Detailed explanation about the error can be found in this [comment](https://github.com/conventional-changelog/commitlint/pull/3871#issuecomment-1911455325).
