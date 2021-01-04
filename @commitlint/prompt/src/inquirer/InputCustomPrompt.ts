// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./inquirer.d.ts" />
import {Interface as ReadlineInterface, Key} from 'readline';

import chalk from 'chalk';
import inquirer from 'inquirer';
import InputPrompt from 'inquirer/lib/prompts/input';
import observe from 'inquirer/lib/utils/events';
import type {Subscription} from 'rxjs/internal/Subscription';

import Answers = inquirer.Answers;
import InputCustomOptions = inquirer.InputCustomOptions;
import Validator = inquirer.Validator;
import SuccessfulPromptStateData = inquirer.prompts.SuccessfulPromptStateData;

interface KeyDescriptor {
	value: string;
	key: Key;
}

export default class InputCustomPrompt<
	TQuestion extends InputCustomOptions = InputCustomOptions
> extends InputPrompt<TQuestion> {
	private lineSubscription: Subscription;
	private readonly tabCompletion: string[];

	constructor(
		question: TQuestion,
		readLine: ReadlineInterface,
		answers: Answers
	) {
		super(question, readLine, answers);

		if (this.opt.log) {
			this.rl.write(this.opt.log(answers));
		}

		if (!this.opt.maxLength) {
			this.throwParamError('maxLength');
		}

		const events = observe(this.rl);
		this.lineSubscription = events.keypress.subscribe(
			this.onKeyPress2.bind(this)
		);
		this.tabCompletion = (this.opt.tabCompletion || [])
			.map((item) => item.value)
			.sort((a, b) => a.localeCompare(b));

		this.opt.validate = this.extendedValidate(this.opt.validate);
	}

	onEnd(state: SuccessfulPromptStateData): void {
		this.lineSubscription.unsubscribe();
		super.onEnd(state);
	}

	extendedValidate(validate?: Validator<TQuestion>): Validator<TQuestion> {
		return (input, answers) => {
			if (input.length > this.opt.maxLength(answers)) {
				return 'Input contains too many characters!';
			}
			if (this.opt.required && input.trim().length === 0) {
				// Show help if enum is defined and input may not be empty
				return `⚠ ${chalk.bold(this.opt.name)} may not be empty.`;
			}

			if (
				input.length > 0 &&
				this.tabCompletion.length > 0 &&
				!this.tabCompletion.includes(input)
			) {
				return `⚠ ${chalk.bold(
					this.opt.name
				)} must be one of ${this.tabCompletion.join(', ')}.`;
			}

			if (validate) {
				return validate(input, answers);
			}
			return true;
		};
	}

	/**
	 * @see https://nodejs.org/api/readline.html#readline_rl_write_data_key
	 * @see https://nodejs.org/api/readline.html#readline_rl_line
	 */
	updateLine(line: string): void {
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		// @ts-ignore
		this.rl.line = line;
		// @ts-ignore
		this.rl.write(null, {ctrl: true, name: 'e'});
	}

	onKeyPress2(e: KeyDescriptor): void {
		if (e.key.name === 'tab' && this.tabCompletion.length > 0) {
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
			return this.opt.filter(input).length;
		}
		return input.length;
	}

	render(error?: string): void {
		const answered = this.status === 'answered';

		let bottomContent = '';
		let message = this.getQuestion();
		const length = this.measureInput(this.rl.line);

		if (answered) {
			message += chalk.cyan(this.answer);
		} else if (this.opt.transformer) {
			message += this.opt.transformer(this.rl.line, this.answers, {});
		}

		if (error) {
			bottomContent = chalk.red('>> ') + error;
		} else if (!answered) {
			const maxLength = this.opt.maxLength(this.answers);
			if (maxLength < Infinity) {
				const lengthRemaining = maxLength - length;
				const color =
					lengthRemaining <= 5
						? chalk.red
						: lengthRemaining <= 10
						? chalk.yellow
						: chalk.grey;
				bottomContent = color(`${lengthRemaining} characters left`);
			}
		}

		this.screen.render(message, bottomContent);
	}
}
