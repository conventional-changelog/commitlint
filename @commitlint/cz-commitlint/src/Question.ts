import chalk from 'chalk';
import inquirer, {
	Answers,
	AsyncDynamicQuestionProperty,
	ChoiceCollection,
	DistinctQuestion,
} from 'inquirer';
import {PromptName} from './types';
import {CaseFn} from './utils/case-fn';
import {FullStopFn} from './utils/full-stop-fn';

type Messages = Record<'title', string> &
	Partial<
		Record<
			| 'skip'
			| 'max'
			| 'min'
			| 'emptyWarning'
			| 'upperLimitWarning'
			| 'lowerLimitWarning',
			string
		>
	>;
export type QuestionConfig = {
	messages: Messages;
	maxLength: number;
	minLength: number;
	defaultValue?: string;
	when?: AsyncDynamicQuestionProperty<boolean, Answers>;
	skip?: boolean;
	enumList?: ChoiceCollection<{
		name: string;
		value: string;
	}>;
	fullStopFn?: FullStopFn;
	caseFn?: CaseFn;
};
export default class Question {
	#data: DistinctQuestion;
	messages: Messages;
	skip: boolean;
	caseFn: CaseFn;
	fullStopFn: FullStopFn;
	maxLength: number;
	minLength: number;
	// hooks
	onBeforeAsk?: (_: Answers) => void;
	constructor(
		name: PromptName,
		{
			enumList,
			messages,
			defaultValue,
			when,
			skip = false,
			fullStopFn = (_: string) => _,
			caseFn = (_: string) => _,
			maxLength = Infinity,
			minLength = 0,
		}: QuestionConfig
	) {
		this.messages = messages;
		this.skip = skip ?? false;
		this.maxLength = maxLength;
		this.minLength = minLength;
		this.fullStopFn = fullStopFn;
		this.caseFn = caseFn;

		if (enumList) {
			this.#data = {
				type: 'list',
				name: name,
				message: this.decorateMessage,
				choices: skip
					? [
							...enumList,
							new inquirer.Separator(),
							{
								name: 'empty',
								value: '',
							},
					  ]
					: enumList,
			};
		} else {
			this.#data = {
				type: /^is[A-Z]/.test(name) ? 'confirm' : 'input',
				name: name,
				message: this.decorateMessage,
				transformer: this.transformer,
			};
		}

		this.#data.default = defaultValue;
		this.#data.when = when;
		this.#data.filter = this.filter;
		this.#data.validate = this.validate;
	}

	getQuestion(): DistinctQuestion {
		return this.#data;
	}

	getQuestionType(): string | undefined {
		return this.#data.type;
	}

	getQuestionName(): string | undefined {
		return this.#data.name;
	}

	validate: (input: string) => boolean | string = (input) => {
		const filterSubject = this.filter(input);

		const questionName = this.getQuestionName() ?? '';

		if (!this.skip && filterSubject.length === 0) {
			return this.messages['emptyWarning']?.replace('%s', questionName) ?? '';
		}

		if (filterSubject.length > this.maxLength) {
			return (
				this.messages['upperLimitWarning']
					?.replace('%s', questionName)
					.replace('%d', `${filterSubject.length - this.maxLength}`) ?? ''
			);
		}

		if (filterSubject.length < this.minLength) {
			return (
				this.messages['lowerLimitWarning']
					?.replace('%s', questionName)
					.replace('%d', `${this.minLength - filterSubject.length}`) ?? ''
			);
		}

		return true;
	};

	filter: (input: string) => string = (input) => {
		return this.caseFn(this.fullStopFn(input.trim()));
	};

	transformer: (input: string, answers: Answers) => string = (input) => {
		if (this.maxLength === Infinity && this.minLength === 0) {
			return input;
		}
		const filterSubject = this.filter(input);
		const color =
			filterSubject.length <= this.maxLength &&
			filterSubject.length >= this.minLength
				? chalk.green
				: chalk.red;
		return color('(' + filterSubject.length + ') ' + input);
	};

	decorateMessage: (answers: Answers) => string = (answers) => {
		this.onBeforeAsk && this.onBeforeAsk(answers);
		if (this.getQuestionType() === 'input') {
			const countLimitMessage = (() => {
				const messages = [];
				if (this.minLength > 0 && this.messages['min']) {
					messages.push(
						this.messages['min'].replace('%d', this.minLength + '')
					);
				}
				if (this.maxLength < Infinity && this.messages['max']) {
					return this.messages['max'].replace('%d', this.maxLength + '');
				}

				return messages.join('');
			})();

			const skipMessage = this.skip ? this.messages['skip'] ?? '' : '';

			return (
				this.messages['title'] + skipMessage + ':' + countLimitMessage + '\n'
			);
		} else {
			return this.messages['title'] + ':';
		}
	};
}
