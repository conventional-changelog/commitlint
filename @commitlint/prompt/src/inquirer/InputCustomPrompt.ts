/// <reference path="./inquirer.d.ts" />
import pc from "picocolors";

import inquirer, { type Answers, type InputCustomOptions } from "inquirer";
import InputPrompt from "inquirer/lib/prompts/input.js";
import observe from "inquirer/lib/utils/events.js";
import type { Interface as ReadlineInterface, Key } from "node:readline";
import type { Subscription } from "rxjs";

import SuccessfulPromptStateData = inquirer.prompts.SuccessfulPromptStateData;

interface KeyDescriptor {
	value: string;
	key: Key;
}

export default class InputCustomPrompt<
	TQuestion extends InputCustomOptions = InputCustomOptions,
> extends InputPrompt<TQuestion> {
	private lineSubscription: Subscription;
	private readonly tabCompletion: string[];

	constructor(
		question: TQuestion,
		readLine: ReadlineInterface,
		answers: Answers,
	) {
		super(question, readLine, answers);

		if (this.opt.log) {
			this.rl.write(this.opt.log(answers));
		}

		if (!this.opt.maxLength) {
			this.throwParamError("maxLength");
		}

		const events = observe(this.rl);
		this.lineSubscription = events.keypress.subscribe(
			this.onKeyPress2.bind(this),
		);
		this.tabCompletion = (this.opt.tabCompletion || [])
			.map((item) => item.value)
			.sort((a, b) => a.localeCompare(b));
	}

	onEnd(state: SuccessfulPromptStateData): void {
		this.lineSubscription.unsubscribe();
		// Add or remove leading blank if rule is active.
		state.value = this.opt.forceLeadingBlankFn(state.value);
		super.onEnd(state);
	}

	/**
	 * @see https://nodejs.org/api/readline.html#readline_rl_write_data_key
	 * @see https://nodejs.org/api/readline.html#readline_rl_line
	 */
	updateLine(line: string): void {
		this.rl.write(null as any, { ctrl: true, name: "b" });
		this.rl.write(null as any, { ctrl: true, name: "d" });
		this.rl.write(line.substr(this.rl.line.length));
	}

	onKeyPress2(e: KeyDescriptor): void {
		if (e.key.name === "tab" && this.tabCompletion.length > 0) {
			let line = this.rl.line.trim();
			if (line.length > 0) {
				for (const item of this.tabCompletion) {
					if (item.startsWith(line) && item !== line) {
						line = item;
						break;
					}
				}
			}
			this.updateLine(line);
		}
	}

	measureInput(input: string): number {
		if (this.opt.filter) {
			return this.opt.filter(input, this.answers).length;
		}
		return input.length;
	}

	render(error?: string): void {
		const answered = this.status === "answered";

		let message = this.getQuestion();
		const length = this.measureInput(this.rl.line);

		if (answered) {
			message += pc.cyan(this.answer);
		} else if (this.opt.transformer) {
			message += this.opt.transformer(this.rl.line, this.answers, {});
		}

		let bottomContent = "";

		if (error) {
			bottomContent = pc.red(">> ") + error;
		} else if (!answered) {
			const maxLength = this.opt.maxLength(this.answers);
			if (maxLength < Infinity) {
				const lengthRemaining = maxLength - length;
				const color =
					lengthRemaining <= 5
						? pc.red
						: lengthRemaining <= 10
							? pc.yellow
							: pc.gray;
				bottomContent = color(`${lengthRemaining} characters left`);
			}
		}

		this.screen.render(message, bottomContent);
	}
}
