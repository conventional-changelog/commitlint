/// <reference path="./inquirer/inquirer.d.ts" />

import { expect, test, vi } from "vitest";
// @ts-expect-error -- no typings
import config from "@commitlint/config-angular";
import pc from "picocolors";
import {
	Answers,
	DistinctQuestion,
	InputCustomOptions,
	PromptModule,
} from "inquirer";

import { input } from "./input.js";

const testConfig = {
	parserPreset: config.parserPreset,
	rules: {
		...config.rules,
	},
};

vi.mock("@commitlint/load", () => ({
	default: () => testConfig,
}));

test("should work with all fields filled", async () => {
	const prompt = stub({
		"input-custom": {
			type: "fix",
			scope: "test",
			subject: "subject",
			body: "body",
			footer: "footer",
		},
	});
	const message = await input(prompt);
	expect(message).toEqual("fix(test): subject\n" + "\nbody\n" + "\nfooter");
});

test("should not add leading blank line to body and footer if rules are disabled", async () => {
	testConfig.rules["body-leading-blank"] = ["1", "never"];
	testConfig.rules["footer-leading-blank"] = ["1", "never"];
	const prompt = stub({
		"input-custom": {
			type: "fix",
			scope: "test",
			subject: "subject",
			body: "body",
			footer: "footer",
		},
	});
	const message = await input(prompt);
	expect(message).toEqual("fix(test): subject\n" + "body\n" + "footer");
	// reset config mock
	testConfig.rules["body-leading-blank"] = config.rules["body-leading-blank"];
	testConfig.rules["footer-leading-blank"] =
		config.rules["footer-leading-blank"];
});

test("should work without scope", async () => {
	const prompt = stub({
		"input-custom": {
			type: "fix",
			scope: "",
			subject: "subject",
			body: "body",
			footer: "footer",
		},
	});
	const message = await input(prompt);
	expect(message).toEqual("fix: subject\n" + "\nbody\n" + "\nfooter");
});

test("should fail without type", async () => {
	const spy = vi.spyOn(console, "error");
	const prompt = stub({
		"input-custom": {
			type: "",
			scope: "",
			subject: "",
			body: "",
			footer: "",
		},
	});
	const message = await input(prompt);
	expect(message).toEqual("");
	expect(console.error).toHaveBeenCalledTimes(1);
	expect(console.error).toHaveBeenLastCalledWith(
		new Error(`⚠ ${pc.bold("type")} may not be empty.`),
	);
	spy.mockRestore();
});

function stub(config: Record<string, Record<string, unknown>>): PromptModule {
	const prompt = async (
		questions: DistinctQuestion | DistinctQuestion[],
	): Promise<any> => {
		const result: Answers = {};
		const resolvedConfig = Array.isArray(questions) ? questions : [questions];
		for (const promptConfig of resolvedConfig) {
			const configType = promptConfig.type || "input";
			const questions = config[configType];
			if (!questions) {
				throw new Error(`Unexpected config type: ${configType}`);
			}
			let answer = questions[promptConfig.name!];
			if (answer == null) {
				throw new Error(`Unexpected config name: ${promptConfig.name}`);
			}
			const validate = promptConfig.validate;
			if (validate) {
				const validationResult = await validate(answer, result);
				if (validationResult !== true) {
					throw new Error(validationResult || undefined);
				}
			}
			const forceLeadingBlankFn = (promptConfig as InputCustomOptions)
				.forceLeadingBlankFn;
			if (forceLeadingBlankFn) {
				answer = forceLeadingBlankFn(answer as string);
			}
			result[promptConfig.name!] = answer;
		}
		return result;
	};
	prompt.registerPrompt = () => {
		return prompt;
	};
	prompt.restoreDefaultPrompts = () => true;
	prompt.prompts = {};
	return prompt as any as PromptModule;
}
