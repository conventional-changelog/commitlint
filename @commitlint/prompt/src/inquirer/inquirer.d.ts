import { Answers, InputQuestionOptions } from "inquirer";

declare module "inquirer" {
	interface InputCustomCompletionOption {
		value: string;
		description?: string;
	}

	export interface InputCustomOptions<T extends Answers = Answers>
		extends InputQuestionOptions<T> {
		/**
		 * @inheritdoc
		 */
		type?: "input-custom";
		log?(answers?: T): string;
		tabCompletion?: InputCustomCompletionOption[];
		maxLength(answers?: T): number;
		forceLeadingBlankFn(input: string): string;
	}

	interface QuestionMap<T extends Answers = Answers> {
		"input-custom": InputCustomOptions<T>;
	}
}
