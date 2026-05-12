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

interface GraphemeSegment {
	segment: string;
	index: number;
	input: string;
	isWordLike?: boolean;
}

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const isPresentation = /^\p{Emoji_Presentation}/u;
const isEmojiBase = /^\p{Emoji}/u;

/**
 * Normalizes emojis to ensure a consistent 2-column width in terminals by appending
 * Variation Selector 16 (U+FE0F).
 * * Emojis like ✨ (U+2728) are "Emoji_Presentation" by default and render at width 2.
 * However, "text-style" emojis like 🛠 (U+1F6E0) or 🗑 (U+1F5D1) default to width 1
 * in many terminals, breaking column alignment.
 * * This function identifies single-grapheme emojis lacking presentation properties
 * and inserts the VS16 immediately after the base character (before modifiers
 * like skin tones) to force graphical rendering without breaking ZWJ sequences.
 * @param emoji The emoji string to normalize.
 * @returns The normalized emoji string with VS16 inserted where necessary.
 */
function normalizeEmoji(emoji: string): string {
	const trimmed = emoji.replace(/\s+$/, "");
	const trailing = emoji.slice(trimmed.length);

	if (trimmed.length === 0) return emoji;

	const segments = Array.from(segmenter.segment(trimmed)) as GraphemeSegment[];

	if (segments.length === 1) {
		const cluster = segments[0].segment;
		const codePoints = Array.from(cluster);
		const baseChar = codePoints[0];

		switch (true) {
			case cluster.includes("\uFE0F"):
			case cluster.includes("\uFE0E"):
				return emoji;

			case isPresentation.test(baseChar):
				return emoji;

			// 3. If the base char is an Emoji base but not presentation:
			case isEmojiBase.test(baseChar) && !/^[0-9#*]$/.test(baseChar): {
				// Reconstruct: Base + VS16 + the rest of the cluster (skin tones, ZWJs, etc.)
				const normalizedCluster = baseChar + "\uFE0F" + codePoints.slice(1).join("");
				return normalizedCluster + trailing;
			}
		}
	}

	return emoji;
}

export default function (rulePrefix: RuleField): QuestionConfig | null {
	const questions = getPromptQuestions();
	const questionSettings = questions[rulePrefix];
	const emptyRule = getRule(rulePrefix, "empty");

	const mustBeEmpty = emptyRule && ruleIsActive(emptyRule) && ruleIsApplicable(emptyRule);

	if (mustBeEmpty) {
		return null;
	}

	const canBeSkip = !emptyRule || ruleIsDisabled(emptyRule);

	const enumRule = getRule(rulePrefix, "enum");
	const enumRuleList = enumRule && enumRuleIsActive(enumRule) ? getEnumList(enumRule) : null;
	let enumList;

	if (enumRuleList) {
		const enumDescriptions = questionSettings?.["enum"];
		const emojiInHeader = questionSettings?.emojiInHeader;

		if (enumDescriptions) {
			const enumNames = Object.keys(enumDescriptions);
			const longest = Math.max(...enumRuleList.map((enumName) => enumName.length));
			const firstHasEmoji = (enumDescriptions[enumNames[0]]?.emoji?.length ?? 0) > 0;
			const hasConsistentEmojiUsage = !enumRuleList.some(
				(enumName) => (enumDescriptions[enumName]?.emoji?.length ?? 0) > 0 !== firstHasEmoji,
			);
			enumList = enumRuleList
				.sort((a, b) => enumNames.indexOf(a) - enumNames.indexOf(b))
				.map((enumName) => {
					const enumDescription = enumDescriptions[enumName]?.description;
					if (enumDescription) {
						const rawEmoji = enumDescriptions[enumName]?.emoji;
						const emoji = rawEmoji ? normalizeEmoji(rawEmoji) : rawEmoji;

						const emojiPrefix = emoji ? `${emoji}  ` : hasConsistentEmojiUsage ? "" : "    ";

						const paddedName = `${enumName}:`.padEnd(longest + 4);

						const name = `${emojiPrefix}${paddedName}${enumDescription}`;

						const value = emojiInHeader && emoji ? `${emoji.trim()} ${enumName}` : enumName;

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
