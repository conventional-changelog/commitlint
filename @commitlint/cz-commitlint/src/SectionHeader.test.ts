import { describe, test, expect, beforeEach } from "vitest";
import { RuleConfigSeverity } from "@commitlint/types";

import {
	combineCommitMessage,
	getQuestions,
	getQuestionConfig,
} from "./SectionHeader.js";
import { setPromptConfig } from "./store/prompts.js";
import { setRules } from "./store/rules.js";

beforeEach(() => {
	setRules({});
	setPromptConfig({
		settings: {
			scopeEnumSeparator: ",",
			enableMultipleScopes: false,
			useExclamationMark: false,
		},
	});
});
describe("getQuestions", () => {
	test("should contain 'type','scope','subject'", () => {
		const questions = getQuestions();
		expect(questions).toHaveLength(3);
		expect(questions).toEqual([
			expect.objectContaining({
				name: "type",
			}),
			expect.objectContaining({
				name: "scope",
			}),
			expect.objectContaining({
				name: "subject",
			}),
		]);
	});

	test("should exclude question when must be empty", () => {
		setRules({
			"scope-empty": [RuleConfigSeverity.Error, "always"],
		});
		const questions = getQuestions();
		expect(questions).toHaveLength(2);
		expect(questions).toEqual([
			expect.objectContaining({
				name: "type",
			}),
			expect.objectContaining({
				name: "subject",
			}),
		]);
	});
});

describe("getQuestionConfig", () => {
	test("should 'scope' supports multiple items separated with ',\\/'", () => {
		const config = getQuestionConfig("scope");
		expect(config).toEqual(
			expect.objectContaining({
				multipleValueDelimiters: /\/|\\|,/g,
			}),
		);
	});

	test("should 'scope' supports multiple select separated with settings.scopeEnumSeparator and enableMultipleScopes", () => {
		setPromptConfig({
			settings: {
				scopeEnumSeparator: "/",
				enableMultipleScopes: true,
			},
		});
		const config = getQuestionConfig("scope");
		expect(config).toEqual(
			expect.objectContaining({
				multipleSelectDefaultDelimiter: "/",
			}),
		);
	});

	test("should 'scope' disable multiple select by default", () => {
		const config = getQuestionConfig("scope");
		expect(config).not.toContain("multipleSelectDefaultDelimiter");
	});
});

describe("combineCommitMessage", () => {
	test("should return correct string when type,scope,subject are not empty", () => {
		const commitMessage = combineCommitMessage({
			type: "build",
			scope: "typescript",
			subject: "update tsconfig.json",
		});
		expect(commitMessage).toBe("build(typescript): update tsconfig.json");
	});
	test("when type is empty", () => {
		let commitMessage = combineCommitMessage({
			scope: "typescript",
			subject: "update tsconfig.json",
		});
		expect(commitMessage).toBe("(typescript): update tsconfig.json");

		commitMessage = combineCommitMessage({
			scope: "typescript",
		});
		expect(commitMessage).toBe("(typescript)");
	});

	test("when scope is empty", () => {
		let commitMessage = combineCommitMessage({
			type: "build",
			subject: "update tsconfig.json",
		});
		expect(commitMessage).toBe("build: update tsconfig.json");

		commitMessage = combineCommitMessage({
			subject: "update tsconfig.json",
		});
		expect(commitMessage).toBe("update tsconfig.json");
	});

	test("when subject is empty", () => {
		const commitMessage = combineCommitMessage({
			type: "build",
			scope: "typescript",
		});
		expect(commitMessage).toBe("build(typescript)");
	});
	test("should add ! after type when isBreaking and useExclamationMark is enabled", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
		});
		const commitMessage = combineCommitMessage({
			type: "feat",
			subject: "add new api",
			isBreaking: true,
		});
		expect(commitMessage).toBe("feat!: add new api");
	});

	test("should add ! after scope when isBreaking and useExclamationMark is enabled", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
		});
		const commitMessage = combineCommitMessage({
			type: "feat",
			scope: "api",
			subject: "add new endpoint",
			isBreaking: true,
		});
		expect(commitMessage).toBe("feat(api)!: add new endpoint");
	});

	test("should not add ! when isBreaking but useExclamationMark is disabled (default)", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: false,
			},
		});
		const commitMessage = combineCommitMessage({
			type: "feat",
			subject: "add new api",
			isBreaking: true,
		});
		expect(commitMessage).toBe("feat: add new api");
	});

	test("should not add ! when useExclamationMark is enabled but not breaking", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
		});
		const commitMessage = combineCommitMessage({
			type: "feat",
			subject: "add new api",
		});
		expect(commitMessage).toBe("feat: add new api");
	});

	test("should add ! without subject when isBreaking and useExclamationMark is enabled", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
		});
		const commitMessage = combineCommitMessage({
			type: "feat",
			scope: "api",
			isBreaking: true,
		});
		expect(commitMessage).toBe("feat(api)!");
	});

	test("should not add ! when type and scope are both empty", () => {
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
		});
		const commitMessage = combineCommitMessage({
			isBreaking: true,
			subject: "drop support",
		});
		expect(commitMessage).toBe("drop support");
	});
});

describe("HeaderQuestion", () => {
	test("should limited by header maxLength and minLength", () => {
		setRules({
			"header-max-length": [RuleConfigSeverity.Error, "always", 20],
			"header-min-length": [RuleConfigSeverity.Error, "always", 10],
			"subject-max-length": [RuleConfigSeverity.Error, "always", 10],
			"subject-min-length": [RuleConfigSeverity.Error, "always", 5],
		});
		setPromptConfig({
			messages: {
				skip: "(press enter to skip)",
				max: "upper %d chars",
				min: "%d chars at least",
				emptyWarning: "%s can not be empty",
				upperLimitWarning: "%s: %s over limit %d",
				lowerLimitWarning: "%s: %s below limit %d",
			},
		});

		const questions = getQuestions();
		const answers = {
			type: "".padEnd(8, "x"),
			scope: "".padEnd(6, "y"),
		};

		const lastQuestion = questions[2];
		(lastQuestion.message as any)(answers);
		expect(lastQuestion?.validate?.("".padEnd(10, "z"), answers)).toBe(
			"subject: subject over limit 6",
		);
	});

	test("should reserve 1 char for '!' when useExclamationMark is enabled", () => {
		const headerMaxLength = 20;
		const type = "refactor";
		const scope = "config";
		// "refactor(config)" = 16 chars
		const charsUsed = `${type}(${scope})`.length; // 16
		const charsAvailable = headerMaxLength - charsUsed - 1; // -1 for '!'
		setRules({
			"header-max-length": [
				RuleConfigSeverity.Error,
				"always",
				headerMaxLength,
			],
			"subject-max-length": [RuleConfigSeverity.Error, "always", 10],
		});
		setPromptConfig({
			settings: {
				useExclamationMark: true,
			},
			messages: {
				skip: "(press enter to skip)",
				max: "upper %d chars",
				min: "%d chars at least",
				emptyWarning: "%s can not be empty",
				upperLimitWarning: "%s: %s over limit %d",
				lowerLimitWarning: "%s: %s below limit %d",
			},
		});
		const questions = getQuestions();
		const answers = { type, scope };
		const subject = questions[2];
		(subject.message as any)(answers);

		expect("fix".length).toBeLessThanOrEqual(charsAvailable);
		expect(subject?.validate?.("fix", answers)).toBe(true);
		expect("test".length).toBeGreaterThan(charsAvailable);
		expect(subject?.validate?.("test", answers)).toBe(
			"subject: subject over limit 1",
		);
	});
});
