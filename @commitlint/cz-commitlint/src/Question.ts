import {PromptMessages, PromptName} from '@commitlint/types';
import chalk from 'chalk';
import inquirer, {Answers, ChoiceCollection, DistinctQuestion} from 'inquirer';

import {CaseFn} from './utils/case-fn.js';
import {FullStopFn} from './utils/full-stop-fn.js';

export type QuestionConfig = {
	title: string;
	messages: PromptMessages;
	maxLength?: number;
	minLength?: number;
	defaultValue?: string;
	when?: DistinctQuestion['when'];
	skip?: boolean;
	enumList?: ChoiceCollection<{
		name: string;
		value: string;
	}> | null;
	multipleValueDelimiters?: RegExp;
	multipleSelectDefaultDelimiter?: string;
	fullStopFn?: FullStopFn;
	caseFn?: CaseFn;
};

export default class Question {
	private _question: Readonly<DistinctQuestion>;
	private messages: PromptMessages;
	private skip: boolean;
	private _maxLength: number;
	private _minLength: number;
	private title: string;
	private caseFn: CaseFn;
	private fullStopFn: FullStopFn;
	private multipleValueDelimiters?: RegExp;
	private multipleSelectDefaultDelimiter?: string;
	constructor(
		name: PromptName,
		{
			title,
			enumList,
			messages,
			defaultValue,
			when,
			skip,
			fullStopFn,
			caseFn,
			maxLength,
			minLength,
			multipleValueDelimiters,
			multipleSelectDefaultDelimiter,
		}: QuestionConfig
	) {
		if (!name || typeof name !== 'string')
			throw new Error('Question: name is required');

		this._maxLength = maxLength ?? Infinity;
		this._minLength = minLength ?? 0;
		this.messages = messages;
		this.title = title ?? '';
		this.skip = skip ?? false;
		this.fullStopFn = fullStopFn ?? ((_: string) => _);
		this.caseFn =
			caseFn ??
			((input: string | string[], delimiter?: string) =>
				Array.isArray(input) ? input.join(delimiter) : input);
		this.multipleValueDelimiters = multipleValueDelimiters;
		this.multipleSelectDefaultDelimiter = multipleSelectDefaultDelimiter;

		if (enumList && Array.isArray(enumList)) {
			this._question = {
				type: multipleSelectDefaultDelimiter ? 'checkbox' : 'list',
				choices: skip
					? [
							...enumList,
							new inquirer.Separator(),
							{
								name: 'empty',
								value: '',
							},
					  ]
					: [...enumList],
			};
		} else if (/^is[A-Z]/.test(name)) {
			this._question = {
				type: 'confirm',
			};
		} else {
			this._question = {
				type: 'input',
				transformer: this.transformer.bind(this),
			};
		}

		Object.assign(this._question, {
			name,
			default: defaultValue,
			when,
			validate: this.validate.bind(this),
			filter: this.filter.bind(this),
			message: this.decorateMessage.bind(this),
		});
	}

	getMessage(key: string): string {
		return this.messages[key] ?? '';
	}

	get question(): Readonly<DistinctQuestion> {
		return this._question;
	}

	get maxLength(): number {
		return this._maxLength;
	}

	set maxLength(maxLength: number) {
		this._maxLength = maxLength;
	}

	get minLength(): number {
		return this._minLength;
	}

	set minLength(minLength: number) {
		this._minLength = minLength;
	}

	protected beforeQuestionStart(_answers: Answers): void {
		return;
	}

	protected validate(input: string): boolean | string {
		const output = this.filter(input);
		const questionName = this.question.name ?? '';
		if (!this.skip && output.length === 0) {
			return this.getMessage('emptyWarning').replace(/%s/g, questionName);
		}

		if (output.length > this.maxLength) {
			return this.getMessage('upperLimitWarning')
				.replace(/%s/g, questionName)
				.replace(/%d/g, `${output.length - this.maxLength}`);
		}

		if (output.length < this.minLength) {
			return this.getMessage('lowerLimitWarning')
				.replace(/%s/g, questionName)
				.replace(/%d/g, `${this.minLength - output.length}`);
		}

		return true;
	}

	protected filter(input: string | string[]): string {
		let toCased;
		if (Array.isArray(input)) {
			toCased = this.caseFn(input, this.multipleSelectDefaultDelimiter);
		} else if (this.multipleValueDelimiters) {
			const segments = input.split(this.multipleValueDelimiters);
			const casedString = this.caseFn(segments, ',');
			const casedSegments = casedString.split(',');
			toCased = input.replace(
				new RegExp(`[^${this.multipleValueDelimiters.source}]+`, 'g'),
				(segment) => {
					return casedSegments[segments.indexOf(segment)];
				}
			);
		} else {
			toCased = this.caseFn(input);
		}

		return this.fullStopFn(toCased);
	}

	protected transformer(input: string, _answers: Answers): string {
		const output = this.filter(input);

		if (this.maxLength === Infinity && this.minLength === 0) {
			return output;
		}
		const color =
			output.length <= this.maxLength && output.length >= this.minLength
				? chalk.green
				: chalk.red;
		return color('(' + output.length + ') ' + output);
	}

	protected decorateMessage(_answers: Answers): string {
		this.beforeQuestionStart && this.beforeQuestionStart(_answers);
		if (this.question.type === 'input') {
			const countLimitMessage = (() => {
				const messages = [];
				if (this.minLength > 0 && this.getMessage('min')) {
					messages.push(
						this.getMessage('min').replace(/%d/g, this.minLength + '')
					);
				}
				if (this.maxLength < Infinity && this.getMessage('max')) {
					messages.push(
						this.getMessage('max').replace(/%d/g, this.maxLength + '')
					);
				}

				return messages.join(', ');
			})();

			const skipMessage = this.skip && this.getMessage('skip');

			return (
				this.title +
				(skipMessage ? ` ${skipMessage}` : '') +
				':' +
				(countLimitMessage ? ` ${countLimitMessage}` : '') +
				'\n'
			);
		} else {
			return `${this.title}:`;
		}
	}
}
