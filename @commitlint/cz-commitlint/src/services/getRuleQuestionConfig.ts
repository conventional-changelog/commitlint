/// <reference lib="es2023.intl" />
import { RuleField } from "@commitlint/types";
import { QuestionConfig } from "../Question.js";
import { getPromptMessages, getPromptQuestions } from "../store/prompts.js";
import { getRule } from "../store/rules.js";
import getCaseFn from "../utils/case-fn.js";
import getFullStopFn from "../utils/full-stop-fn.js";
import {
	enumRuleIsActive,
	getEnumList,
	getMaxLength,
	getMinLength,
	ruleIsActive,
	ruleIsApplicable,
	ruleIsDisabled,
} from "../utils/rules.js";

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const isPresentation = /^\p{Emoji_Presentation}/u;
const isEmojiBase = /^\p{Emoji}/u;

/**
 * Appends Unicode Variation Selector 16 (U+FE0F) to emojis missing it,
 * forcing emoji-width (2 col, like ✨) presentation in terminals. Without VS16,
 * emojis like 🛠 (U+1F6E0) and 🗑 (U+1F5D1) render at text-width (1 col),
 * breaking column alignment in interactive menus.
 */
function normalizeEmoji(emoji: string): string {
	const trimmed = emoji.replace(/\s+$/, "");
	const trailing = emoji.slice(trimmed.length);

	if (trimmed.length === 0) return emoji;

	const segments = Array.from(segmenter.segment(trimmed));

	if (segments.length === 1) {
		const char = segments[0].segment;

		switch (true) {
			case char.includes("\uFE0F"):
			case char.includes("\uFE0E"):
				return emoji;

			case isPresentation.test(char):
				return emoji;

			// Is it a "Text-style" emoji base and not a number? Add VS16!
			case isEmojiBase.test(char) && !/^[0-9#*]$/.test(char):
				return trimmed + "\uFE0F" + trailing;
		}
	}

	return emoji;
}

export default function (rulePrefix: RuleField): QuestionConfig | null {
	const questions = getPromptQuestions();
	const questionSettings = questions[rulePrefix];
	const emptyRule = getRule(rulePrefix, "empty");

	const mustBeEmpty =
		emptyRule && ruleIsActive(emptyRule) && ruleIsApplicable(emptyRule);

	if (mustBeEmpty) {
		return null;
	}

	const canBeSkip = !emptyRule || ruleIsDisabled(emptyRule);

	const enumRule = getRule(rulePrefix, "enum");
	const enumRuleList =
		enumRule && enumRuleIsActive(enumRule) ? getEnumList(enumRule) : null;
	let enumList;

	if (enumRuleList) {
		const enumDescriptions = questionSettings?.["enum"];
		const emojiInHeader = questionSettings?.emojiInHeader;

		if (enumDescriptions) {
			const enumNames = Object.keys(enumDescriptions);
			const longest = Math.max(
				...enumRuleList.map((enumName) => enumName.length),
			);
			const firstHasEmoji =
				(enumDescriptions[enumNames[0]]?.emoji?.length ?? 0) > 0;
			const hasConsistentEmojiUsage = !enumRuleList.some(
				(enumName) =>
					(enumDescriptions[enumName]?.emoji?.length ?? 0) > 0 !==
					firstHasEmoji,
			);
			enumList = enumRuleList
				.sort((a, b) => enumNames.indexOf(a) - enumNames.indexOf(b))
				.map((enumName) => {
					const enumDescription = enumDescriptions[enumName]?.description;
					if (enumDescription) {
						const rawEmoji = enumDescriptions[enumName]?.emoji;
						const emoji = rawEmoji ? normalizeEmoji(rawEmoji) : rawEmoji;

						const emojiPrefix = emoji
							? `${emoji}  `
							: hasConsistentEmojiUsage
								? ""
								: "    ";

						const paddedName = `${enumName}:`.padEnd(longest + 4);

						const name = `${emojiPrefix}${paddedName}${enumDescription}`;

						const value =
							emojiInHeader && emoji ? `${emoji.trim()} ${enumName}` : enumName;

						return { name, value, short: enumName };
					} else {
						return enumName;
					}
				});
		} else {
			enumList = [...enumRuleList];
		}
	}

	return {
		skip: canBeSkip,
		enumList,
		title: questionSettings?.["description"] ?? `${rulePrefix}:`,
		caseFn: getCaseFn(getRule(rulePrefix, "case")),
		fullStopFn: getFullStopFn(getRule(rulePrefix, "full-stop")),
		minLength: getMinLength(getRule(rulePrefix, "min-length")),
		maxLength: getMaxLength(getRule(rulePrefix, "max-length")),
		messages: getPromptMessages(),
	};
}
