# Examples

These examples show common usages of how commitlint can be configured.

## Validate for issue/ticket numbers

::: code-group

```jsonc [package.json]
{
  // ...
  "commitlint": {
    "rules": {
      "references-empty": [2, "never"],
    },
    "parserPreset": {
      "parserOpts": {
        "issuePrefixes": ["PROJ-"],
      },
    },
  },
  // ...
}
```

:::

## Customizing Emojis and Alignment in VS Code

Some terminals have trouble correctly calculating the width of Unicode emojis, which can cause a missing space after the emoji, leading to misaligned text in the commit prompt.

![cz-commitlint questions](/assets/vs-code-emoji.png)

To fix this issue in VS Code, you can specify an additional space after each emoji in your `commitlint.config.ts` file.

::: code-group

```ts [commitlint.config.ts]
import { type UserConfig } from "@commitlint/types";

export default {
  // Use the conventional commit rules as a base.
  extends: ["@commitlint/config-conventional"],
  prompt: {
    questions: {
      type: {
        enum: {
          // Add a space to a few common types for better alignment.
          build: {
            emoji: "🛠️ ", // The extra space fixes the alignment.
          },
          chore: {
            emoji: "♻️ ",
          },
          ci: {
            emoji: "⚙️ ",
          },
          revert: {
            emoji: "🗑️ ",
          },
        },
      },
    },
  },
} satisfies UserConfig;
```

:::

## Include Emojis in Commit Messages

By default, emojis are only shown in the commit message prompt. To include them in the actual commit header, you need a custom parser and a setting to enable them.

This configuration is based on the conventional commit rules and uses a _parser preset_ to validate commit headers that start with an emoji.

::: code-group

```ts [commitlint.config.ts]
import type { ParserPreset, UserConfig } from "@commitlint/types";
import config from "@commitlint/config-conventional";
import createPreset from "conventional-changelog-conventionalcommits";
import { merge } from "lodash-es";

// A helper function to create the custom emoji parser preset.
async function createEmojiParser(): Promise<ParserPreset> {
  // Generates the regex from the emojis defined in the conventional config.
  const emojiRegexPart = Object.values(config.prompt.questions.type.enum)
    .map((value) => value.emoji.trim())
    .join("|");

  const parserOpts = {
    // This regular expression validates commit headers with an emoji.
    breakingHeaderPattern: new RegExp(
      `^(?:${emojiRegexPart})\\s+(\\w*)(?:\\((.*)\\))?!:\\s+(.*)$`,
    ),
    headerPattern: new RegExp(
      `^(?:${emojiRegexPart})\\s+(\\w*)(?:\\((.*)\\))?!?:\\s+(.*)$`,
    ),
  };

  const emojiParser = merge({}, await createPreset(), {
    conventionalChangelog: { parserOpts },
    parserOpts,
    recommendedBumpOpts: { parserOpts },
  });

  return emojiParser;
}

const emojiParser = await createEmojiParser();

export default {
  extends: ["@commitlint/config-conventional"],
  parserPreset: emojiParser,
  prompt: {
    questions: {
      type: {
        enum: {
          // Customize emojis and add the extra space for better alignment.
          build: { emoji: "🛠️ " },
          chore: { emoji: "♻️ " },
          ci: { emoji: "⚙️ " },
          revert: { emoji: "🗑️ " },
        },
        // This setting includes the emoji in the final commit header.
        headerWithEmoji: true,
      },
    },
  },
} satisfies UserConfig;
```

:::

Although some emojis may appear without a trailing space in the terminal, the commit message itself is submitted with the correct formatting.

![cz-commitlint questions](/assets/vs-code-commit-msg.png)

You can verify this with `git log -4 --format=%B > commits.txt`.

:::code-group

```text [commits.txt]
⚙️ ci(scope): short

🛠 build(scope): short

🐛 fix(scope): short

✨ feat(scope): short
```

:::
