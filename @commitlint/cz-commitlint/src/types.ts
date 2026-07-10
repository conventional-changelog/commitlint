import { RuleConfigCondition, RuleConfigSeverity } from "@commitlint/types";

export type Rule =
	| Readonly<[RuleConfigSeverity.Disabled]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition]>
	| Readonly<[RuleConfigSeverity, RuleConfigCondition, unknown]>;

export type PromptAnswers = Record<string, any>;

export type PromptQuestion = {
	name?: string;
	type?: string;
	choices?: Array<string | { name: string; value: string } | unknown>;
	default?: unknown;
	when?: (answers: PromptAnswers) => boolean | Promise<boolean>;
	validate?: (
		input: string,
		answers?: PromptAnswers,
	) => boolean | string | Promise<boolean | string>;
	filter?: (input: string | string[], answers: PromptAnswers) => string;
	transformer?: (input: string, answers: PromptAnswers) => string;
	message?: string | ((answers: PromptAnswers) => string | Promise<string>);
};
