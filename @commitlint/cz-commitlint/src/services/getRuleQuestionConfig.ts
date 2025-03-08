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

		if (enumDescriptions) {
			const enumNames = Object.keys(enumDescriptions);
			const longest = Math.max(
				...enumRuleList.map((enumName) => enumName.length),
			);
			// TODO emoji + title
			enumList = enumRuleList
				.sort((a, b) => enumNames.indexOf(a) - enumNames.indexOf(b))
				.map((enumName) => {
					const enumDescription = enumDescriptions[enumName]?.description;
					if (enumDescription) {
						return {
							name: `${enumName}:`.padEnd(longest + 4) + enumDescription,
							value: enumName,
							short: enumName,
						};
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
