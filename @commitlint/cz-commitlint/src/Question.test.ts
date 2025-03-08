import { describe, test, expect, vi } from "vitest";
import chalk from "chalk";
import inquirer, { Answers, InputQuestionOptions } from "inquirer";

import Question from "./Question.js";

const MESSAGES = {
	skip: "(press enter to skip)",
	max: "upper %d chars",
	min: "%d chars at least",
	emptyWarning: "%s can not be empty",
	upperLimitWarning: "%s: %s over limit %d",
	lowerLimitWarning: "%s: %s below limit %d",
};
const QUESTION_CONFIG = {
	title: "please input",
	messages: MESSAGES,
};

const caseFn = (input: string | string[], delimiter?: string) =>
	(Array.isArray(input) ? input : [input])
		.map((segment) => segment[0].toUpperCase() + segment.slice(1))
		.join(delimiter);

describe("name", () => {
	test("should throw error when name is not a meaningful string", () => {
		expect(
			() =>
				new Question("" as any, {
					...QUESTION_CONFIG,
				}),
		).toThrow();

		expect(
			() =>
				new Question(
					function () {
						return "scope";
					} as any,
					{
						...QUESTION_CONFIG,
					},
				),
		).toThrow();
	});

	test("should set name when name is valid", () => {
		expect(
			new Question("test" as any, {
				...QUESTION_CONFIG,
			}).question,
		).toHaveProperty("name", "test");
	});
});

describe("type", () => {
	test('should return "list" type when enumList is array and multipleSelectDefaultDelimiter is undefined', () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			enumList: ["cli", "core"],
		}).question;
		expect(question).toHaveProperty("type", "list");
		expect(question).toHaveProperty("choices", ["cli", "core"]);
		expect(question).not.toHaveProperty("transformer");
	});

	test('should return "checkbox" type when enumList is array and multipleSelectDefaultDelimiter is defined', () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			enumList: ["cli", "core"],
			multipleSelectDefaultDelimiter: ",",
		}).question;
		expect(question).toHaveProperty("type", "checkbox");
		expect(question).toHaveProperty("choices", ["cli", "core"]);
		expect(question).not.toHaveProperty("transformer");
	});

	test('should contain "skip" list item when enumList is array and skip is true', () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			enumList: ["cli", "core"],
			skip: true,
		}).question;
		expect(question).toHaveProperty("type", "list");
		expect(question).toHaveProperty("choices", [
			"cli",
			"core",
			new inquirer.Separator(),
			{
				name: "empty",
				value: "",
			},
		]);
		expect(question).not.toHaveProperty("transformer");
	});

	test('should return "confirm" type when name is start with "is"', () => {
		const question = new Question("isSubmit" as any, {
			...QUESTION_CONFIG,
		}).question;
		expect(question).toHaveProperty("type", "confirm");
		expect(question).not.toHaveProperty("choices");
		expect(question).not.toHaveProperty("transformer");
	});

	test('should return "input" type in other cases', () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
		}).question;
		expect(question).toHaveProperty("type", "input");
		expect(question).not.toHaveProperty("choices");
		expect(question).toHaveProperty("transformer", expect.any(Function));
	});
});

describe("message", () => {
	test("should display title when it is not input", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			enumList: ["cli", "core"],
		}).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe("please input:");
	});

	test("should display skip hint when it is input and can skip", () => {
		const question = new Question("body" as any, {
			...QUESTION_CONFIG,
			skip: true,
		}).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe(
			"please input (press enter to skip):\n",
		);
	});

	test("should not display skip hint when it is input and without skip string", () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			messages: {},
			skip: true,
		} as any).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe("please input:\n");
	});

	test("should display upper limit hint when it is input and has max length", () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			maxLength: 80,
		} as any).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe("please input: upper 80 chars\n");
	});

	test("should display lower limit hint when it is input and has min length", () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			minLength: 10,
		} as any).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe(
			"please input: 10 chars at least\n",
		);
	});

	test("should display hints with correct format", () => {
		const question = new Question("scope", {
			...QUESTION_CONFIG,
			minLength: 10,
			maxLength: 80,
			skip: true,
		} as any).question;
		expect(question).toHaveProperty("message", expect.any(Function));
		expect((question.message as any)()).toBe(
			"please input (press enter to skip): 10 chars at least, upper 80 chars\n",
		);
	});

	test("should execute function beforeQuestionStart when init message", () => {
		const mockFn = vi.fn();
		class CustomQuestion extends Question {
			beforeQuestionStart(answers: Answers): void {
				mockFn(answers);
			}
		}
		const question = new CustomQuestion("body", {
			...QUESTION_CONFIG,
		} as any).question;
		expect(question).toHaveProperty("message", expect.any(Function));

		const answers = {
			header: "This is header",
			footer: "This is footer",
		};
		(question.message as any)(answers);
		expect(mockFn).toHaveBeenCalledWith(answers);
	});
});

describe("filter", () => {
	test("should auto fix case and full-stop", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn,
			fullStopFn: (input: string) => input + "!",
		}).question;

		expect(question.filter?.("xxxx", {})).toBe("Xxxx!");
	});

	test("should transform each item with same case when input is array", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn,
			fullStopFn: (input: string) => input + "!",
		}).question;

		expect(question.filter?.(["xxxx", "yyyy"], {})).toBe("Xxxx,Yyyy!");
	});

	test("should concat items with multipleSelectDefaultDelimiter when input is array", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn,
			fullStopFn: (input: string) => input + "!",
			multipleSelectDefaultDelimiter: "|",
		}).question;

		expect(question.filter?.(["xxxx", "yyyy"], {})).toBe("Xxxx|Yyyy!");
	});

	test("should split the string to items when multipleValueDelimiters is defined", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn,
			fullStopFn: (input: string) => input + "!",
			multipleValueDelimiters: /,|\|/g,
		}).question;

		expect(question.filter?.("xxxx,yyyy|zzzz", {})).toBe("Xxxx,Yyyy|Zzzz!");
		expect(question.filter?.("xxxx-yyyy-zzzz", {})).toBe("Xxxx-yyyy-zzzz!");
	});

	test("should works well when does not pass caseFn/fullStopFn", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
		}).question;

		expect(question.filter?.("xxxx", {})).toBe("xxxx");
	});
});

describe("validate", () => {
	test("should display empty warning when can not skip but string is empty", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			skip: false,
		}).question;

		expect(question.validate?.("")).toBe("body can not be empty");
	});

	test("should ignore empty validation when can skip", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			skip: true,
		}).question;

		expect(question.validate?.("")).toBe(true);
	});

	test("should display upper limit warning when char count is over upper limit", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			maxLength: 5,
		}).question;

		expect(question.validate?.("xxxxxx")).toBe("body: body over limit 1");
	});

	test("should display lower limit warning when char count is less than lower limit", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			minLength: 5,
		}).question;

		expect(question.validate?.("xxx")).toBe("body: body below limit 2");
	});

	test("should validate the final submit string", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn: () => "",
			skip: false,
		}).question;

		expect(question.validate?.("xxxx")).not.toBe(true);
	});
});

describe("transformer", () => {
	test("should auto transform case and full-stop", () => {
		const question = new Question("body", {
			...QUESTION_CONFIG,
			caseFn,
			fullStopFn: (input: string) => input + "!",
		}).question;

		expect(
			(question as InputQuestionOptions)?.transformer?.("xxxx", {}, {}),
		).toBe("Xxxx!");
	});

	test("should char count with green color when in the limit range", () => {
		let question = new Question("body", {
			...QUESTION_CONFIG,
			maxLength: 5,
		}).question;

		expect(
			(question as InputQuestionOptions)?.transformer?.("xxx", {}, {}),
		).toEqual(chalk.green(`(3) xxx`));

		question = new Question("body", {
			...QUESTION_CONFIG,
			minLength: 2,
		}).question;

		expect(
			(question as InputQuestionOptions)?.transformer?.("xxx", {}, {}),
		).toEqual(chalk.green(`(3) xxx`));
	});

	test("should char count with red color when over the limit range", () => {
		let question = new Question("body", {
			...QUESTION_CONFIG,
			maxLength: 5,
		}).question;

		expect(
			(question as InputQuestionOptions)?.transformer?.("xxxxxx", {}, {}),
		).toEqual(chalk.red(`(6) xxxxxx`));

		question = new Question("body", {
			...QUESTION_CONFIG,
			minLength: 2,
		}).question;

		expect(
			(question as InputQuestionOptions)?.transformer?.("x", {}, {}),
		).toEqual(chalk.red(`(1) x`));
	});
});

describe("inquirer question", () => {
	test('should pass "when" and "default" field to inquirer question', () => {
		const when = (answers: Answers) => !!answers.header;
		const question = new Question("body", {
			...QUESTION_CONFIG,
			when,
			defaultValue: "update",
		}).question;

		expect(question).toHaveProperty("default", "update");
		expect(question).toHaveProperty("when", when);
	});
});
