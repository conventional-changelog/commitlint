/// <reference path="./inquirer.d.ts" />
import chalk from 'chalk';
import inquirer from 'inquirer';
import InputPrompt from 'inquirer/lib/prompts/input';
import observe from 'inquirer/lib/utils/events';
import type {Interface as ReadlineInterface, Key} from 'readline';
import type {Subscription} from 'rxjs/internal/Subscription';

import Answers = inquirer.Answers;
import InputCustomOptions = inquirer.InputCustomOptions;
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
	}

	onEnd(state: SuccessfulPromptStateData): void {
		this.lineSubscription.unsubscribe();
		super.onEnd(state);
	}

	/**
	 * @see https://nodejs.org/api/readline.html#readline_rl_write_data_key
	 * @see https://nodejs.org/api/readline.html#readline_rl_line
	 */
	updateLine(line: string): void {
		this.rl.write(null as any, {ctrl: true, name: 'b'});
		this.rl.write(null as any, {ctrl: true, name: 'd'});
		this.rl.write(line.substr(this.rl.line.length));
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

		let message = this.getQuestion();
		const length = this.measureInput(this.rl.line);

		if (answered) {
			message += chalk.cyan(this.answer);
		} else if (this.opt.transformer) {
			message += this.opt.transformer(this.rl.line, this.answers, {});
		}

		let bottomContent = '';

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
